'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Mic, Image as ImageIcon, Video, Send } from 'lucide-react';

export default function UniversalUpload() {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    // TODO: Implement submission logic
    console.log({ text, file });
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-background border rounded-lg shadow-sm">
      <div className="space-y-4">
        <Textarea
          placeholder="Ask a question or describe your problem..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[100px] resize-none"
        />
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={() => document.getElementById('image-upload')?.click()}>
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => document.getElementById('video-upload')?.click()}>
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Mic className="h-4 w-4" />
            </Button>
            
            <Input 
              id="image-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange}
            />
            <Input 
              id="video-upload" 
              type="file" 
              accept="video/*" 
              className="hidden" 
              onChange={handleFileChange}
            />
          </div>
          
          <Button onClick={handleSubmit}>
            <Send className="mr-2 h-4 w-4" />
            Submit
          </Button>
        </div>
        
        {file && (
          <div className="text-sm text-muted-foreground">
            Selected: {file.name}
          </div>
        )}
      </div>
    </div>
  );
}
