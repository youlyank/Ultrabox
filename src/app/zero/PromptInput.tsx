"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Wand2 } from "lucide-react";

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  disabled?: boolean;
}

const examples = [
  "Build a task management app with drag-and-drop",
  "Create an e-commerce site with Stripe payments",
  "Real-time chat app with WebSocket and authentication",
  "Blog platform with Markdown and user accounts",
  "API dashboard with charts and real-time updates",
  "Social media app with posts and comments",
  "Project management tool with Kanban board",
  "Weather app with location-based forecasts"
];

export default function PromptInput({ onSubmit, disabled = false }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const [showExamples, setShowExamples] = useState(false);

  const handleSubmit = () => {
    if (prompt.trim()) {
      onSubmit(prompt.trim());
    }
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
    setShowExamples(false);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Wand2 className="h-5 w-5 text-orange-600" />
            <h3 className="font-semibold">Describe Your Project</h3>
          </div>
          
          <Textarea
            placeholder="Tell me what you want to build. Be as specific as possible about features, technologies, and requirements..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="resize-none"
            disabled={disabled}
          />
          
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowExamples(!showExamples)}
              className="text-xs"
            >
              <Lightbulb className="h-4 w-4 mr-1" />
              {showExamples ? "Hide" : "Show"} Examples
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600">
                {prompt.length}/500 characters
              </span>
              <Button
                onClick={handleSubmit}
                disabled={disabled || !prompt.trim()}
                size="sm"
              >
                Generate
              </Button>
            </div>
          </div>
          
          {showExamples && (
            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-2">Try these examples:</p>
              <div className="flex flex-wrap gap-2">
                {examples.map((example) => (
                  <Badge
                    key={example}
                    variant="secondary"
                    className="cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"
                    onClick={() => handleExampleClick(example)}
                  >
                    {example}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="text-xs text-slate-600 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <strong>Pro tip:</strong> Include specific technologies, features, and requirements for better results.
            Example: "Build a React task management app with TypeScript, PostgreSQL, drag-and-drop, and user authentication."
          </div>
        </div>
      </CardContent>
    </Card>
  );
}