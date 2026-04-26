import {
  Activity,
  Bot,
  Braces,
  CheckCircle2,
  ClipboardList,
  Cpu,
  Database,
  FileJson,
  Gauge,
  GitBranch,
  MessageSquareText,
  Play,
  RefreshCw,
  Search,
  Settings2,
  Sparkles,
  TerminalSquare,
  Wrench,
} from "lucide-react"
import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const demoAgents = [
  {
    name: "Research Agent",
    icon: Search,
    status: "ready",
    focus: "资料检索",
    brief: "拆解问题、检索资料、提炼可信结论。",
  },
  {
    name: "Coding Agent",
    icon: TerminalSquare,
    status: "running",
    focus: "代码执行",
    brief: "读取项目、修改文件、运行验证命令。",
  },
  {
    name: "Workflow Agent",
    icon: GitBranch,
    status: "queued",
    focus: "任务编排",
    brief: "规划步骤、调用工具、追踪上下文状态。",
  },
]

const tools = [
  { name: "Web Search", icon: Search, enabled: true },
  { name: "File System", icon: FileJson, enabled: true },
  { name: "Database", icon: Database, enabled: false },
  { name: "Code Runner", icon: Braces, enabled: true },
]

const traces = [
  "读取用户目标并生成任务计划",
  "选择 Research Agent 补全上下文",
  "调用 Web Search 获取参考材料",
  "把结论交给 Coding Agent 生成 demo",
  "运行验证并输出下一步建议",
]

const promptTemplates = [
  "帮我设计一个能调用工具的学习计划 agent。",
  "把这个任务拆成 observe、think、act、verify 四个阶段。",
  "模拟一次多 agent 协作，并解释每一步的上下文传递。",
]

function App() {
  const [selectedAgent, setSelectedAgent] = useState(demoAgents[1].name)
  const [temperature, setTemperature] = useState(0.4)
  const [memoryEnabled, setMemoryEnabled] = useState(true)
  const [prompt, setPrompt] = useState(promptTemplates[1])

  const selectedAgentInfo = useMemo(
    () => demoAgents.find((agent) => agent.name === selectedAgent) ?? demoAgents[0],
    [selectedAgent],
  )
  const SelectedIcon = selectedAgentInfo.icon

  console.log("render", { selectedAgent, temperature, memoryEnabled })

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef6f4_45%,#f7f3e8_100%)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-normal sm:text-2xl">Agent Demo Lab</h1>
              <p className="text-sm text-muted-foreground">日常练习 agent 规划、工具调用、记忆和执行轨迹。</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              重置
            </Button>
            <Button size="sm">
              <Play className="mr-2 h-4 w-4" />
              运行 Demo
            </Button>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)_320px]">
          <aside className="flex flex-col gap-4">
            <div className="rounded-lg border bg-card p-3 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Cpu className="h-4 w-4 text-primary" />
                Agents
              </div>
              <div className="space-y-2">
                {demoAgents.map((agent) => {
                  const Icon = agent.icon
                  const active = selectedAgent === agent.name
                  return (
                    <button
                      key={agent.name}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-md border p-3 text-left transition-colors",
                        active ? "border-primary bg-primary/10" : "border-transparent bg-muted/40 hover:bg-muted",
                      )}
                      onClick={() => setSelectedAgent(agent.name)}
                    >
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">{agent.name}</span>
                        <span className="block text-xs text-muted-foreground">{agent.focus}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="rounded-lg border bg-card p-3 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Wrench className="h-4 w-4 text-primary" />
                Tools
              </div>
              <div className="space-y-2">
                {tools.map((tool) => {
                  const Icon = tool.icon
                  return (
                    <div key={tool.name} className="flex items-center justify-between rounded-md bg-muted/45 px-3 py-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="truncate text-sm">{tool.name}</span>
                      </div>
                      <span
                        className={cn(
                          "h-2.5 w-2.5 rounded-full",
                          tool.enabled ? "bg-primary" : "bg-muted-foreground/35",
                        )}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </aside>

          <section className="flex flex-col gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-3">
                <div className="min-w-0">
                  <CardTitle className="flex items-center gap-2">
                    <SelectedIcon className="h-4 w-4 text-primary" />
                    {selectedAgentInfo.name}
                  </CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">{selectedAgentInfo.brief}</p>
                </div>
                <span className="rounded-md bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
                  {selectedAgentInfo.status}
                </span>
              </CardHeader>
              <CardContent>
                <textarea
                  className="min-h-[180px] w-full resize-none rounded-md border bg-background p-3 text-sm leading-6 outline-none transition focus:ring-2 focus:ring-ring"
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {promptTemplates.map((template) => (
                    <Button
                      key={template}
                      variant="outline"
                      size="sm"
                      onClick={() => setPrompt(template)}
                    >
                      <MessageSquareText className="mr-2 h-4 w-4" />
                      模板
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-primary" />
                    Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>1. 明确目标和约束</p>
                  <p>2. 选择工具和数据源</p>
                  <p>3. 执行并持续校验</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-primary" />
                    Config
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <label className="block text-sm">
                    <span className="mb-2 flex items-center justify-between">
                      <span>Temperature</span>
                      <span className="font-medium">{temperature.toFixed(1)}</span>
                    </span>
                    <input
                      className="w-full accent-teal-700"
                      max="1"
                      min="0"
                      step="0.1"
                      type="range"
                      value={temperature}
                      onChange={(event) => setTemperature(Number(event.target.value))}
                    />
                  </label>
                  <label className="flex items-center justify-between text-sm">
                    <span>Memory</span>
                    <input
                      checked={memoryEnabled}
                      className="h-4 w-4 accent-teal-700"
                      type="checkbox"
                      onChange={(event) => setMemoryEnabled(event.target.checked)}
                    />
                  </label>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-2xl font-semibold">5</p>
                    <p className="text-muted-foreground">steps</p>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">3</p>
                    <p className="text-muted-foreground">tools</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <aside className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="h-4 w-4 text-primary" />
                Trace
              </div>
              <Button variant="ghost" size="icon" aria-label="设置">
                <Settings2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              {traces.map((trace, index) => (
                <div key={trace} className="flex gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted">
                    {index < 3 ? (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-accent" />
                    )}
                  </div>
                  <div className="min-w-0 border-b border-border pb-3 text-sm last:border-b-0">
                    <p className="leading-5">{trace}</p>
                    <p className="mt-1 text-xs text-muted-foreground">step {index + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}

export default App
