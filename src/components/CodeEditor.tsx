import { CODING_QUESTIONS, LANGUAGES } from "@/constants";
import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AlertCircleIcon, BookIcon, LightbulbIcon, CodeIcon } from "lucide-react";
import Editor from "@monaco-editor/react";

function CodeEditor() {
  const [selectedQuestion, setSelectedQuestion] = useState(CODING_QUESTIONS[0]);
  const [language, setLanguage] = useState<"javascript" | "python" | "java">(LANGUAGES[0].id);
  const [code, setCode] = useState(selectedQuestion.starterCode[language]);

  const handleQuestionChange = (questionId: string) => {
    const question = CODING_QUESTIONS.find((q) => q.id === questionId)!;
    setSelectedQuestion(question);
    setCode(question.starterCode[language]);
  };

  const handleLanguageChange = (newLanguage: "javascript" | "python" | "java") => {
    setLanguage(newLanguage);
    setCode(selectedQuestion.starterCode[newLanguage]);
  };

  return (
    <ResizablePanelGroup direction="vertical" className="min-h-[calc-100vh-4rem-1px]">
      {/* QUESTION SECTION */}
      <ResizablePanel defaultSize={40} minSize={20}>
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* HEADER */}
              <div className="glass-strong rounded-2xl p-6 border-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="glass-subtle rounded-full p-2 glow-blue">
                        <CodeIcon className="w-5 h-5 text-blue-500" />
                      </div>
                      <h2 className="text-2xl font-bold gradient-text">
                        {selectedQuestion.title}
                      </h2>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Choose your approach and showcase your coding skills
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* Question selector */}
                    <Select value={selectedQuestion.id} onValueChange={handleQuestionChange}>
                      <SelectTrigger className="w-[180px] glass-subtle border-0 focus:ring-2 focus:ring-blue-500/50">
                        <SelectValue placeholder="Select question" />
                      </SelectTrigger>
                      <SelectContent className="glass border-0">
                        {CODING_QUESTIONS.map((q) => (
                          <SelectItem 
                            key={q.id} 
                            value={q.id}
                            className="focus:bg-white/10 rounded-lg mx-1"
                          >
                            {q.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Language selector */}
                    <Select value={language} onValueChange={handleLanguageChange}>
                      <SelectTrigger className="w-[150px] glass-subtle border-0 focus:ring-2 focus:ring-blue-500/50">
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            <img
                              src={`/${language}.png`}
                              alt={language}
                              className="w-5 h-5 object-contain"
                            />
                            <span className="font-medium">
                              {LANGUAGES.find((l) => l.id === language)?.name}
                            </span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="glass border-0">
                        {LANGUAGES.map((lang) => (
                          <SelectItem 
                            key={lang.id} 
                            value={lang.id}
                            className="focus:bg-white/10 rounded-lg mx-1"
                          >
                            <div className="flex items-center gap-2">
                              <img
                                src={`/${lang.id}.png`}
                                alt={lang.name}
                                className="w-5 h-5 object-contain"
                              />
                              <span className="font-medium">{lang.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* PROBLEM DESCRIPTION */}
              <Card className="glass border-0 liquid-hover">
                <CardHeader className="flex flex-row items-center gap-3 pb-4">
                  <div className="glass-subtle rounded-full p-2 glow-green">
                    <BookIcon className="h-5 w-5 text-green-500" />
                  </div>
                  <CardTitle className="text-lg">Problem Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
                      {selectedQuestion.description}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              {/* EXAMPLES */}
              <Card className="glass border-0 liquid-hover">
                <CardHeader className="flex flex-row items-center gap-3 pb-4">
                  <div className="glass-subtle rounded-full p-2 glow-purple">
                    <LightbulbIcon className="h-5 w-5 text-purple-500" />
                  </div>
                  <CardTitle className="text-lg">Examples</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedQuestion.examples.map((example, index) => (
                      <div key={index} className="glass-subtle rounded-xl p-4 space-y-3">
                        <p className="font-medium text-sm text-blue-400">
                          Example {index + 1}:
                        </p>
                        <div className="glass rounded-lg p-4 font-mono text-sm space-y-2">
                          <div className="flex flex-wrap gap-4">
                            <div>
                              <span className="text-green-400 font-medium">Input:</span>
                              <span className="ml-2">{example.input}</span>
                            </div>
                            <div>
                              <span className="text-blue-400 font-medium">Output:</span>
                              <span className="ml-2">{example.output}</span>
                            </div>
                          </div>
                          {example.explanation && (
                            <div className="pt-2 border-t border-white/10">
                              <span className="text-purple-400 font-medium">Explanation:</span>
                              <span className="ml-2 text-muted-foreground">
                                {example.explanation}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* CONSTRAINTS */}
              {selectedQuestion.constraints && (
                <Card className="glass border-0 liquid-hover">
                  <CardHeader className="flex flex-row items-center gap-3 pb-4">
                    <div className="glass-subtle rounded-full p-2">
                      <AlertCircleIcon className="h-5 w-5 text-orange-500" />
                    </div>
                    <CardTitle className="text-lg">Constraints</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedQuestion.constraints.map((constraint, index) => (
                        <div key={index} className="flex items-start gap-3 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500/60 mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground leading-relaxed">
                            {constraint}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          <ScrollBar />
        </ScrollArea>
      </ResizablePanel>

      <ResizableHandle withHandle className="glass-subtle border-0 h-1 my-1 rounded-full" />

      {/* CODE EDITOR */}
      <ResizablePanel defaultSize={60} minSize={30}>
        <div className="h-full relative glass border-0 rounded-2xl overflow-hidden">
          {/* Editor header */}
          <div className="glass-subtle p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {selectedQuestion.title}.{language}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                Press Ctrl/Cmd + S to save
              </div>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="h-[calc(100%-4rem)]">
            <Editor
              height="100%"
              defaultLanguage={language}
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 16,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 20, bottom: 20 },
                wordWrap: "on",
                wrappingIndent: "indent",
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Monaco', monospace",
                fontLigatures: true,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                smoothScrolling: true,
                renderLineHighlight: "gutter",
                bracketPairColorization: { enabled: true },
              }}
            />
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default CodeEditor;