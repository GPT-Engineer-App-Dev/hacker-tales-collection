import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, ThumbsUp, Search, Terminal } from 'lucide-react';

const fetchTopStories = async () => {
  const response = await fetch('https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=100');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, error } = useQuery({
    queryKey: ['topStories'],
    queryFn: fetchTopStories,
  });

  const filteredStories = data?.hits.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (error) return <div className="text-center text-red-500">An error occurred: {error.message}</div>;

  return (
    <div className="min-h-screen p-8 bg-black text-green-500 font-mono overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold flex items-center">
            <Terminal className="mr-2" />
            HN_Top_100
          </h1>
          <div className="relative w-64">
            <Input
              type="text"
              placeholder="grep stories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-900 border-green-500 text-green-500 placeholder-green-700"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-700" />
          </div>
        </header>
        <AnimatePresence>
          <motion.div 
            className="grid gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {isLoading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <Card key={index} className="animate-pulse bg-gray-900 border-green-500">
                  <CardHeader>
                    <div className="h-6 bg-green-900 rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-green-900 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-green-900 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              filteredStories.map(story => (
                <motion.div
                  key={story.objectID}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-gray-900 border-green-500 hover:bg-gray-800 transition-colors duration-300">
                    <CardHeader>
                      <CardTitle className="text-green-400">{story.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <ThumbsUp className="mr-2 h-4 w-4 text-green-600" />
                          <span>{story.points} points</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="bg-green-900 hover:bg-green-800 text-green-500 border-green-500"
                        >
                          <a href={story.url} target="_blank" rel="noopener noreferrer">
                            cat story.txt <ExternalLink className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
