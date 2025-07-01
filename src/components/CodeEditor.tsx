import { CODING_QUESTIONS, LANGUAGES } from "@/constants";
import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AlertCircleIcon, BookIcon, LightbulbIcon } from "lucide-react";
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
    <ResizablePanelGroup direction="vertical" className="h-full bg-background">
      {/* Problem Section */}
      <ResizablePanel defaultSize={40} minSize={25}>
        <div className="h-full bg-gradient-to-br from-muted/30 to-background border-b border-border/30">
          <ScrollArea className="h-full">
            <div className="p-8 space-y-8">
              {/* Enhanced Header Controls */}
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">
                    {selectedQuestion.title}
                  </h2>
                  <p className="text-muted-foreground">
                    Choose your programming language and solve the challenge
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <Select value={selectedQuestion.id} onValueChange={handleQuestionChange}>
                    <SelectTrigger className="w-48 h-11 rounded-xl border-border/60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/20">
                      {CODING_QUESTIONS.map((q) => (
                        <SelectItem key={q.id} value={q.id} className="text-sm rounded-lg">
                          {q.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="w-36 h-11 rounded-xl border-border/60">
                      <SelectValue>
                        <div className="flex items-center gap-3">
                          <img
                            src={`/${language}.png`}
                            alt={language}
                            className="w-5 h-5"
                          />
                          <span className="font-medium">
                            {LANGUAGES.find((l) => l.id === language)?.name}
                          </span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/20">
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.id} value={lang.id} className="rounded-lg">
                          <div className="flex items-center gap-3">
                            <img
                              src={`/${lang.id}.png`}
                              alt={lang.name}
                              className="w-5 h-5"
                            />
                            <span className="font-medium">{lang.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Enhanced Problem Description */}
              <Card className="border-border/60 bg-gradient-surface rounded-2xl shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
                      <BookIcon className="h-4 w-4 text-primary" />
                    </div>
                    Problem Description
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-foreground leading-relaxed whitespace-pre-line">
                    {selectedQuestion.description}
                  </p>
                </CardContent>
              </Card>

              {/* Enhanced Examples */}
              <Card className="border-border/60 bg-gradient-surface rounded-2xl shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                      <LightbulbIcon className="h-4 w-4 text-yellow-600" />
                    </div>
                    Examples
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-6">
                  {selectedQuestion.examples.map((example, index) => (
                    <div key={index} className="space-y-3">
                      <p className="font-semibold text-foreground">Example {index + 1}:</p>
                      <div className="bg-muted/50 rounded-xl p-4 border border-border/30">
                        <pre className="text-sm font-mono space-y-1">
                          <div className="text-foreground"><span className="text-primary font-semibold">Input:</span> {example.input}</div>
                          <div className="text-foreground"><span className="text-green-600 font-semibold">Output:</span> {example.output}</div>
                          {example.explanation && (
                            <div className="pt-2 text-muted-foreground">
                              <span className="text-blue-600 font-semibold">Explanation:</span> {example.explanation}
                            </div>
                          )}
                        </pre>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Enhanced Constraints */}
              {selectedQuestion.constraints && (
                <Card className="border-border/60 bg-gradient-surface rounded-2xl shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500/10 rounded-xl flex items-center justify-center">
                        <AlertCircleIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      Constraints
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2">
                      {selectedQuestion.constraints.map((constraint, index) => (
                        <li key={index} className="text-muted-foreground flex items-start gap-3">
                          <span className="w-2 h-2 bg-primary/60 rounded-full mt-2.5 flex-shrink-0"></span>
                          <span className="font-mono text-sm">{constraint}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
            <ScrollBar />
          </ScrollArea>
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle className="bg-border/30 hover:bg-primary/20 transition-colors h-1" />

      {/* Enhanced Code Editor */}
      <ResizablePanel defaultSize={60} minSize={30}>
        <div className="h-full bg-[#1e1e1e] rounded-tl-3xl overflow-hidden">
          <div className="h-12 bg-[#2d2d30] px-6 flex items-center border-b border-[#3e3e42]">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-white/70 text-sm font-medium ml-2">
                {selectedQuestion.title}.{language === "javascript" ? "js" : language === "python" ? "py" : "java"}
              </span>
            </div>
          </div>
          <Editor
            height="calc(100% - 3rem)"
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
              fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
              lineHeight: 1.7,
              renderLineHighlight: "line",
              selectOnLineNumbers: true,
              contextmenu: false,
              smoothScrolling: true,
              cursorBlinking: "smooth",
              renderWhitespace: "selection",
              bracketPairColorization: { enabled: true },
            }}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default CodeEditor;