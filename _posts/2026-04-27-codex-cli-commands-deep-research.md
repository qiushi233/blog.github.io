---
layout: post
title: "Codex CLI 命令深度分析：从入门到精通的完整指南"
date: 2026-04-27
categories: [AI, Developer Tools]
tags: [OpenAI, Codex, CLI, Agent, 命令行]
---

> 本文是对 OpenAI Codex CLI 的深度研究报告，系统梳理其命令体系、沙箱机制、配置方式与最佳实践，帮助开发者真正用好这款 AI 编程 Agent。

---

## 一、Codex CLI 是什么

Codex CLI 是 OpenAI 于 2025 年 4 月开源的轻量级命令行 AI 编程 Agent，核心定位是"在终端里运行的 AI 编程助手"。它不是简单的代码补全工具，而是一个能够读写文件、执行 Shell 命令、运行测试、自主完成多步骤编程任务的 Agent。

项目地址：[github.com/openai/codex](https://github.com/openai/codex)，MIT 协议开源，截至 2026 年 4 月已获得超过 30,000 Star。

与 Claude Code 的定位对比：Codex CLI 更强调"轻量、可嵌入、沙箱安全"，而 Claude Code 更强调"深度代码理解与大上下文推理"。两者都是 Agentic 编程工具，但设计哲学有所不同。

---

## 二、安装与初始化

### 安装

```bash
npm install -g @openai/codex
```

要求 Node.js 22 或更高版本。安装后通过 `codex --version` 验证。

### 认证

Codex CLI 通过环境变量读取 API Key：

```bash
export OPENAI_API_KEY="sk-..."
```

也支持 `~/.codex/config.toml` 中配置（见第五节）。

### 首次运行

```bash
codex
```

不带任何参数启动交互式 REPL 模式，进入对话界面后可直接用自然语言描述任务。

---

## 三、核心命令行参数（CLI Flags）

### 基础用法

```
codex [options] [prompt]
```

`prompt` 是可选的初始任务描述，支持直接在命令行传入，也可以进入交互模式后输入。

### 完整参数列表

| 参数 | 简写 | 说明 |
|------|------|------|
| `--model <model>` | `-m` | 指定使用的模型，默认 `codex-mini-latest` |
| `--approval-policy <policy>` | `-a` | 审批策略：`untrusted`（默认）/ `on-request` / `never` |
| `--sandbox <mode>` | | 沙箱模式（见第四节） |
| `--config <path>` | `-c` | 指定配置文件路径 |
| `--quiet` | `-q` | 静默模式，减少输出 |
| `--no-project-doc` | | 不加载 AGENTS.md 文件 |
| `--no-git-context` | | 不注入 git 状态上下文 |
| `--full-stdout` | | 显示完整的命令输出（不截断） |
| `--notify` | | 任务完成后发送系统通知 |
| `--dangerously-auto-approve-everything` | | 自动批准所有操作（危险！） |
| `--version` | `-v` | 显示版本号 |
| `--help` | `-h` | 显示帮助信息 |

### 模型选择

```bash
# 使用 GPT-4.1（高质量，较慢）
codex --model gpt-4.1 "重构这个模块"

# 使用 codex-mini（快速，适合简单任务）
codex --model codex-mini-latest "给这个函数加注释"

# 使用 o4-mini（推理增强）
codex --model o4-mini "分析这段代码的时间复杂度"
```

### 审批策略

```bash
# 默认：每次操作都需要确认（最安全）
codex --approval-policy untrusted "修复所有 lint 错误"

# 仅在 Agent 主动请求时确认
codex --approval-policy on-request "运行测试套件"

# 全自动，不需要任何确认（CI/CD 场景）
codex --approval-policy never "生成 API 文档"
```

---

## 四、沙箱模式（Sandbox）

沙箱是 Codex CLI 安全体系的核心，控制 Agent 对系统资源的访问权限。

### 三种沙箱级别

**1. `read-only`（只读模式）**

Agent 只能读取文件，不能写入或执行命令。适合代码审查、分析类任务。

```bash
codex --sandbox read-only "分析这个项目的架构"
```

**2. `workspace-write`（工作区写入，默认）**

Agent 可以读写当前工作目录内的文件，可以执行命令，但网络访问受限。这是日常开发的推荐模式。

```bash
codex --sandbox workspace-write "实现用户登录功能"
```

**3. `danger-full-access`（完全访问）**

Agent 拥有完整的系统访问权限，包括网络、系统文件等。仅在完全信任的环境中使用。

```bash
codex --sandbox danger-full-access "部署到生产环境"
```

### macOS 沙箱实现

在 macOS 上，Codex CLI 使用 Apple 的 `sandbox-exec` 机制实现沙箱隔离，这是系统级的安全保障，而非仅靠 Agent 的"自我约束"。这意味着即使 Agent 被"越狱"，底层系统调用也会被拦截。

### Linux 沙箱实现

Linux 上使用 `landlock` + `seccomp` 实现类似的系统调用过滤。

---

## 五、交互模式中的 Slash Commands

进入交互式 REPL 后，可以使用以下斜杠命令控制 Agent 行为：

### 会话控制

| 命令 | 说明 |
|------|------|
| `/help` | 显示所有可用命令 |
| `/exit` 或 `/quit` | 退出 Codex CLI |
| `/clear` | 清空当前对话历史 |
| `/history` | 查看当前会话的对话历史 |

### 上下文管理

| 命令 | 说明 |
|------|------|
| `/context` | 显示当前注入的上下文（AGENTS.md、git 状态等） |
| `/model <name>` | 在会话中切换模型 |
| `/approval <policy>` | 动态修改审批策略 |

### 任务控制

| 命令 | 说明 |
|------|------|
| `/undo` | 撤销上一步操作（如果可能） |
| `/diff` | 显示当前会话中所有文件变更的 diff |

### 键盘快捷键

在交互模式中，以下快捷键同样重要：

| 快捷键 | 说明 |
|--------|------|
| `Ctrl+C` | 中断当前 Agent 操作 |
| `Ctrl+D` | 退出 CLI |
| `Ctrl+R` | 搜索历史输入 |
| `↑` / `↓` | 浏览输入历史 |
| `Tab` | 自动补全（文件路径等） |

---

## 六、AGENTS.md 分层配置机制

AGENTS.md 是 Codex CLI 最强大也最容易被忽视的功能之一。它允许开发者在不同层级定义 Agent 的行为规范。

### 三层加载顺序

```
~/.codex/AGENTS.md          ← 全局配置（个人偏好）
    ↓
<repo-root>/AGENTS.md       ← 项目配置（团队规范）
    ↓
<current-dir>/AGENTS.md     ← 目录配置（局部覆盖）
```

下层配置会追加（而非覆盖）上层配置，形成叠加效果。

### AGENTS.md 内容示例

```markdown
# Project: E-Commerce Backend

## Tech Stack
- Language: TypeScript (strict mode)
- Framework: NestJS
- Database: PostgreSQL with TypeORM
- Testing: Jest

## Code Style
- Always use async/await, never raw Promises
- All public methods must have JSDoc comments
- Error handling: use custom AppException class

## Testing Requirements
- Unit test coverage must be > 80%
- Run `npm test` before marking any task complete
- Integration tests live in `test/` directory

## Forbidden Operations
- Never modify `src/config/production.ts`
- Never commit secrets or API keys
- Never use `any` type in TypeScript

## Workflow
1. Read existing code before making changes
2. Run linter after each file modification
3. Update CHANGELOG.md for significant changes
```

### 高级用法：条件配置

```markdown
## When working on authentication module
- Always check JWT expiry handling
- Verify RBAC permissions are applied

## When working on database migrations
- Create rollback migration alongside forward migration
- Test on staging data first
```

### 禁用 AGENTS.md

```bash
codex --no-project-doc "快速修复这个 bug"
```

---

## 七、config.toml 配置文件

`~/.codex/config.toml` 是持久化配置的核心文件。

### 完整配置示例

```toml
# 默认模型
model = "codex-mini-latest"

# 默认审批策略
approval_policy = "untrusted"

# 默认沙箱模式
sandbox = "workspace-write"

# 通知设置
notify = true

# 自定义 API 端点（用于代理或私有部署）
api_base_url = "https://api.openai.com/v1"

# 历史记录保留条数
history_size = 1000

# 是否自动加载 git 上下文
git_context = true

# 是否自动加载 AGENTS.md
project_doc = true
```

### 多配置文件切换

```bash
# 使用工作配置
codex --config ~/.codex/work-config.toml "..."

# 使用个人配置
codex --config ~/.codex/personal-config.toml "..."
```

---

## 八、典型使用场景与命令示例

### 场景一：日常开发任务

```bash
# 实现新功能
codex "在 UserService 中添加邮箱验证功能，包含单元测试"

# 修复 Bug
codex "修复 issue #123：用户登录后 session 没有正确保存"

# 代码重构
codex "将 utils.js 中的回调函数全部重构为 async/await"
```

### 场景二：代码审查与分析

```bash
# 只读模式分析
codex --sandbox read-only "分析这个项目的安全漏洞"

# 生成代码审查报告
codex --sandbox read-only --quiet "对最近的 git diff 进行代码审查，输出 Markdown 报告"
```

### 场景三：CI/CD 自动化

```bash
# 全自动模式（适合 CI 环境）
codex --approval-policy never --quiet \
  "运行测试，如果失败则自动修复，直到所有测试通过"

# 生成发布说明
codex --approval-policy never \
  "根据 git log 生成 CHANGELOG.md 的新版本条目"
```

### 场景四：多文件重构

```bash
# 大规模重命名
codex "将整个项目中的 UserController 重命名为 AccountController，更新所有引用"

# 依赖升级
codex "将项目从 React 17 升级到 React 18，处理所有 breaking changes"
```

### 场景五：文档生成

```bash
# API 文档
codex --sandbox read-only "为所有 REST API 端点生成 OpenAPI 3.0 规范文档"

# README 更新
codex "根据当前代码状态更新 README.md 的安装和使用说明"
```

---

## 九、管道与脚本集成

Codex CLI 支持标准 Unix 管道，可以无缝集成到现有工作流中。

### 从标准输入读取

```bash
# 分析错误日志
cat error.log | codex "分析这些错误，找出根本原因"

# 审查 diff
git diff HEAD~1 | codex "审查这个 diff，指出潜在问题"
```

### 输出到文件

```bash
# 生成报告
codex --quiet "分析代码质量" > quality-report.md

# 生成测试用例
codex --quiet "为 auth.ts 生成完整的测试用例" > auth.test.ts
```

### 在 Shell 脚本中使用

```bash
#!/bin/bash
# 自动化代码审查脚本

CHANGED_FILES=$(git diff --name-only HEAD~1)

for file in $CHANGED_FILES; do
  echo "Reviewing $file..."
  codex --sandbox read-only --quiet \
    "审查 $file 的代码质量，输出简洁的问题列表" \
    >> review-report.md
done

echo "Review complete: review-report.md"
```

---

## 十、与其他工具的集成

### 与 Git Hooks 集成

```bash
# .git/hooks/pre-commit
#!/bin/bash
codex --approval-policy never --quiet \
  "检查暂存的文件是否有明显的 bug 或安全问题，如有则输出警告"
```

### 与 VS Code 集成

通过 VS Code 的 Terminal 直接使用，或配置为 Task：

```json
// .vscode/tasks.json
{
  "tasks": [
    {
      "label": "Codex: Fix Current File",
      "type": "shell",
      "command": "codex --approval-policy on-request 'Fix issues in ${file}'",
      "group": "build"
    }
  ]
}
```

### 与 Makefile 集成

```makefile
# Makefile
.PHONY: ai-review ai-fix ai-docs

ai-review:
	codex --sandbox read-only "审查最近的代码变更"

ai-fix:
	codex "修复所有 lint 错误和类型错误"

ai-docs:
	codex --sandbox read-only "更新所有过时的文档注释"
```

---

## 十一、安全最佳实践

### 原则一：最小权限

始终从最严格的沙箱开始，只在必要时升级权限：

```bash
# 先用只读模式理解代码
codex --sandbox read-only "解释这段代码的逻辑"

# 确认理解后再允许写入
codex --sandbox workspace-write "按照刚才的分析重构代码"
```

### 原则二：审查每一步

在生产代码库中，始终使用默认的 `untrusted` 审批策略，逐步确认每个操作。

### 原则三：版本控制保护

在运行 Codex 之前，确保工作区是干净的 git 状态：

```bash
git stash  # 保存当前工作
codex "..."
git diff   # 审查变更
git add -p # 选择性暂存
```

### 原则四：敏感文件保护

在 AGENTS.md 中明确声明禁止修改的文件：

```markdown
## Protected Files
- Never modify: .env, .env.production, secrets.yaml
- Never read: private keys, certificates
```

### 原则五：CI 环境隔离

在 CI/CD 中使用专用的低权限 API Key，并设置使用量限制。

---

## 十二、调试与故障排除

### 查看详细日志

```bash
# 开启 debug 模式
DEBUG=codex:* codex "..."

# 查看 Agent 的完整思考过程
codex --full-stdout "..."
```

### 常见问题

**问题：Agent 陷入循环**
解决：按 `Ctrl+C` 中断，然后用 `/clear` 清空上下文重新开始。

**问题：文件修改超出预期范围**
解决：使用 `git diff` 审查变更，用 `git checkout` 回滚不需要的修改。

**问题：API 超时**
解决：将大任务拆分为小任务，或切换到更快的模型（如 `codex-mini-latest`）。

**问题：沙箱权限不足**
解决：根据实际需要升级沙箱级别，但要理解安全影响。

---

## 十三、横向对比：Codex CLI vs Claude Code 命令体系

| 维度 | Codex CLI | Claude Code |
|------|-----------|-------------|
| 启动方式 | `codex` / `codex "task"` | `claude` / `claude "task"` |
| 配置文件 | `~/.codex/config.toml` | `~/.claude/settings.json` |
| 项目配置 | `AGENTS.md` | `CLAUDE.md` |
| 沙箱机制 | 系统级（sandbox-exec/landlock） | 进程级隔离 |
| 审批粒度 | 操作级别 | 工具调用级别 |
| 管道支持 | 原生支持 | 原生支持 |
| 交互命令 | `/help`, `/clear`, `/diff` 等 | `/help`, `/clear`, `/compact` 等 |
| 多模型切换 | 支持（`--model`） | 支持（`--model`） |
| 离线能力 | 不支持 | 不支持 |

两者的命令体系设计理念相近，但 Codex CLI 的沙箱机制更为底层和严格，而 Claude Code 的上下文管理（如 `/compact`）更为精细。

---

## 十四、总结与建议

Codex CLI 的命令体系设计体现了几个核心理念：

**安全优先**：三层沙箱机制 + 审批策略，让开发者始终掌控 Agent 的行为边界。

**渐进式信任**：从 `untrusted` 到 `never`，根据任务性质和环境逐步放开权限，而非一刀切。

**可配置性**：AGENTS.md 的分层机制让团队可以在项目级别定义 AI 协作规范，这是工程化 AI 开发的重要基础。

**Unix 哲学**：原生支持管道和脚本集成，让 Codex CLI 成为工具链中的一等公民，而非孤立的 GUI 工具。

对于想要在日常开发中引入 AI Agent 的团队，建议的上手路径是：先用只读模式熟悉工具 → 在个人项目中开启写入权限 → 为团队项目编写 AGENTS.md 规范 → 最后在 CI/CD 中集成自动化任务。

---

*本文基于 Codex CLI v0.1.x 版本，部分功能可能随版本更新而变化。最新信息请参考 [官方文档](https://github.com/openai/codex)。*

*报告生成时间：2026-04-27*
