import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://your-project.supabase.co'
const supabaseAnonKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Project {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  github_url?: string;
  demo_url?: string;
  category: 'project' | 'tutorial' | 'advertisement';
  created_at: string;
  updated_at: string;
}

// Initialize the projects table
export const initializeDatabase = async () => {
  try {
    // Create projects table if it doesn't exist
    const { error } = await supabase.rpc('create_projects_table', {})
    if (error && !error.message.includes('already exists')) {
      console.error('Error creating table:', error)
    }
  } catch (error) {
    console.error('Database initialization error:', error)
  }
}

// Project CRUD operations
export const projectService = {
  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('projects')
      .insert([{
        ...project,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getAllProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getProject(id: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async deleteProject(id: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  async uploadImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `project-images/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('projects')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from('projects')
      .getPublicUrl(filePath)

    return data.publicUrl
  }
}