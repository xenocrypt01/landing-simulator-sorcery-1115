import { useState, useRef } from 'react';
import { Upload, Download, Github, ExternalLink, Play, Code, Camera, FileText, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  github?: string;
  demo?: string;
  category: 'project' | 'tutorial' | 'advertisement';
  date: string;
}

const Portfolio = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'Arcade Game Engine',
      description: 'A powerful game engine built with React and TypeScript for creating retro-style arcade games.',
      category: 'project',
      date: '2024-01-15',
      github: 'https://github.com/mrsmile',
      demo: 'https://demo.mrsmile.dev'
    },
    {
      id: '2',
      title: 'React Hooks Tutorial',
      description: 'Complete guide to mastering React Hooks with practical examples and best practices.',
      category: 'tutorial',
      date: '2024-01-10'
    }
  ]);
  
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    category: 'project' as const,
    github: '',
    demo: ''
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 5MB",
          variant: "destructive"
        });
        return;
      }
      setSelectedFile(file);
      toast({
        title: "File selected",
        description: `${file.name} is ready to upload`
      });
    }
  };

  const handleAddProject = () => {
    if (!newProject.title || !newProject.description) {
      toast({
        title: "Missing information",
        description: "Please fill in title and description",
        variant: "destructive"
      });
      return;
    }

    const project: Project = {
      id: Date.now().toString(),
      ...newProject,
      date: new Date().toISOString().split('T')[0],
      image: selectedFile ? URL.createObjectURL(selectedFile) : undefined
    };

    setProjects([project, ...projects]);
    setNewProject({ title: '', description: '', category: 'project', github: '', demo: '' });
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    toast({
      title: "Project added!",
      description: "Your project has been successfully added to the portfolio"
    });
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
    toast({
      title: "Project deleted",
      description: "Project has been removed from your portfolio"
    });
  };

  const filteredProjects = (category: string) => 
    projects.filter(p => category === 'all' || p.category === category);

  return (
    <div className="min-h-screen bg-arcade-dark text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-arcade-dark via-arcade-terminal to-arcade-dark">
        <div className="absolute inset-0 bg-gradient-to-r from-arcade-purple/20 to-arcade-pink/20"></div>
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-arcade-purple to-arcade-pink p-1">
            <div className="w-full h-full rounded-full bg-arcade-dark flex items-center justify-center">
              <span className="text-4xl">😊</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            <span className="gradient-text">Mr Smile</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-6">
            Full Stack Developer & Game Creator
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
            Passionate about creating innovative games, tutorials, and digital experiences. 
            Turning ideas into reality with code and creativity.
          </p>
          <div className="flex justify-center space-x-4">
            <Button className="bg-arcade-purple hover:bg-arcade-purple/80">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
            <Button variant="outline" className="border-arcade-purple text-arcade-purple hover:bg-arcade-purple hover:text-white">
              <Download className="mr-2 h-4 w-4" />
              Resume
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Add New Project Section */}
        <Card className="mb-12 bg-arcade-terminal border-gray-800">
          <CardHeader>
            <CardTitle className="text-arcade-purple flex items-center">
              <Upload className="mr-2 h-5 w-5" />
              Add New Project
            </CardTitle>
            <CardDescription>
              Upload your latest projects, tutorials, or advertisements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Project Title"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                className="bg-arcade-dark border-gray-700"
              />
              <select
                value={newProject.category}
                onChange={(e) => setNewProject({ ...newProject, category: e.target.value as any })}
                className="bg-arcade-dark border border-gray-700 rounded-md px-3 py-2 text-white"
              >
                <option value="project">Project</option>
                <option value="tutorial">Tutorial</option>
                <option value="advertisement">Advertisement</option>
              </select>
            </div>
            
            <Textarea
              placeholder="Project Description"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="bg-arcade-dark border-gray-700"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="GitHub URL (optional)"
                value={newProject.github}
                onChange={(e) => setNewProject({ ...newProject, github: e.target.value })}
                className="bg-arcade-dark border-gray-700"
              />
              <Input
                placeholder="Demo URL (optional)"
                value={newProject.demo}
                onChange={(e) => setNewProject({ ...newProject, demo: e.target.value })}
                className="bg-arcade-dark border-gray-700"
              />
            </div>

            <div className="flex items-center space-x-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="border-arcade-purple text-arcade-purple hover:bg-arcade-purple hover:text-white"
              >
                <Camera className="mr-2 h-4 w-4" />
                Upload Screenshot
              </Button>
              {selectedFile && (
                <span className="text-sm text-gray-400">
                  {selectedFile.name}
                </span>
              )}
            </div>

            <Button onClick={handleAddProject} className="bg-arcade-purple hover:bg-arcade-purple/80">
              Add Project
            </Button>
          </CardContent>
        </Card>

        {/* Projects Section */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-arcade-terminal">
            <TabsTrigger value="all" className="data-[state=active]:bg-arcade-purple">All</TabsTrigger>
            <TabsTrigger value="project" className="data-[state=active]:bg-arcade-purple">Projects</TabsTrigger>
            <TabsTrigger value="tutorial" className="data-[state=active]:bg-arcade-purple">Tutorials</TabsTrigger>
            <TabsTrigger value="advertisement" className="data-[state=active]:bg-arcade-purple">Ads</TabsTrigger>
          </TabsList>

          {['all', 'project', 'tutorial', 'advertisement'].map((category) => (
            <TabsContent key={category} value={category} className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects(category).map((project) => (
                  <Card key={project.id} className="bg-arcade-terminal border-gray-800 hover:border-arcade-purple transition-colors group">
                    <CardHeader className="pb-2">
                      {project.image && (
                        <div className="aspect-video rounded-lg overflow-hidden mb-4">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">{project.title}</CardTitle>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              project.category === 'project' ? 'bg-arcade-purple/20 text-arcade-purple' :
                              project.category === 'tutorial' ? 'bg-arcade-pink/20 text-arcade-pink' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {project.category === 'project' && <Code className="inline mr-1 h-3 w-3" />}
                              {project.category === 'tutorial' && <FileText className="inline mr-1 h-3 w-3" />}
                              {project.category === 'advertisement' && <Camera className="inline mr-1 h-3 w-3" />}
                              {project.category}
                            </span>
                            <span className="text-xs text-gray-400">{project.date}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-gray-400 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-300 mb-4">
                        {project.description}
                      </CardDescription>
                      <div className="flex space-x-2">
                        {project.github && (
                          <Button variant="outline" size="sm" className="border-gray-700 hover:border-arcade-purple">
                            <Github className="mr-1 h-3 w-3" />
                            Code
                          </Button>
                        )}
                        {project.demo && (
                          <Button variant="outline" size="sm" className="border-gray-700 hover:border-arcade-purple">
                            <ExternalLink className="mr-1 h-3 w-3" />
                            Demo
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {filteredProjects(category).length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-xl font-semibold mb-2">No {category === 'all' ? 'projects' : category + 's'} yet</h3>
                  <p className="text-gray-400">Start by adding your first {category === 'all' ? 'project' : category}!</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold gradient-text mb-2">Mr Smile Modders</h3>
            <p className="text-gray-400">Creating amazing digital experiences</p>
          </div>
          <div className="flex justify-center space-x-6 mb-6">
            <a href="#" className="text-gray-400 hover:text-arcade-purple transition-colors">
              <Github className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-arcade-purple transition-colors">
              <ExternalLink className="h-6 w-6" />
            </a>
          </div>
          <p className="text-sm text-gray-500">
            © 2025 Mr Smile Modders. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;