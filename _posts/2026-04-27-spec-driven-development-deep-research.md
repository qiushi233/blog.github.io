---
title: "Spec-Driven Development 深度研究：从 Vibe Coding 失控到规格驱动的工程化之路"
date: 2026-04-27 10:00:00 +0800
author: latte
categories: [深度研究]
tags: [Spec-Driven Development, Superpowers, Spec Kit, Vibe Coding, AI Coding, 工程化]
toc: true
---

## 一、历史演进：这场范式转变从哪里来

### 代码生成工具爆发前夜（2022-2023）

2022年6月，GitHub Copilot正式向公众开放。这是第一款大规模商用的AI代码补全工具，它背后的技术基础来自OpenAI的Codex模型。Copilot的工作逻辑很简单：看你在打什么，猜你下一行想写什么，然后给你补全。它的本质是一个极其聪明的「Tab键」。

这个定位非常保守，也非常明智。它把AI定位成程序员的辅助工具，而不是能自主完成任务的Agent。这保证了它能快速融入现有工作流，不打断程序员的思维节奏。但同时，这种「补全」的逻辑也天然有个上限：它不理解你在做什么，也不知道你最终要达到什么目标。

2023年初，随着GPT-4发布，AI的代码能力发生了质变。模型不再只是补全代码，而是开始能理解较为复杂的需求并生成完整函数，甚至完整模块。这个变化推动了一批新型AI编程工具的涌现——Cursor于2023年上半年开始快速崛起，它把整个代码编辑器包裹在AI能力之内，让用户可以用自然语言直接描述要修改什么、新增什么、重构什么。

这是一个关键转折：AI第一次从「自动补全工具」升级为「能执行意图的对话伙伴」。

### Vibe Coding 的诞生与爆炸（2025年2月）

2025年2月6日，Andrej Karpathy——OpenAI联合创始人、特斯拉前AI总监、AI领域最受关注的技术布道者之一——在X（原Twitter）上发了一条帖子，正式提出了「Vibe Coding」这个词：

> "There's a new kind of coding I call 'vibe coding', where you fully give in to the vibes, embrace exponentials, and forget that the code even exists."

这条帖子迅速在开发者社区引爆。Vibe Coding描述的是一种全新的开发方式：你不再需要关心语法、不需要记函数名，你只需要向AI描述你的「感觉」和「意图」，AI自动生成代码，你只需要验证结果是否符合期望。

这个概念为什么爆了？因为它说出了很多人已经在做、但没有命名的事情。当Cursor、Claude等工具足够强大时，确实有大量开发者开始用一种非常随意的方式工作：扔给AI一个模糊的想法，看它生成什么，不满意就再说一遍，直到差不多为止。这在个人项目、快速原型、小工具场景里效率极高。

Vibe Coding这个词，也成为了2025年Collins词典的年度词汇，标志着这种现象已经从开发者圈子溢出到了更广泛的文化讨论中。

但Karpathy自己也说过：「Vibe coding适合demo和实验，如果涉及生产系统，你最好还是理解你在做什么。」这句隐隐的警告，为后来的反思埋下了伏笔。

### 失控感开始出现：工程团队的困惑（2025年上半年）

Vibe Coding爆火之后，一波反思迅速跟上。大量有工程背景的开发者开始分享他们的真实体验：

AI确实能在几分钟内生成几百行代码，但问题是：这些代码符合你的系统架构吗？它有没有破坏现有约定？它有没有被测试覆盖？如果三个月后你要改这段代码，你能快速理解它在干什么吗？

这些问题在个人项目里不是大问题，但在团队协作的生产系统里，每一个都是真实的工程负债。

团队开始发现几个反复出现的模式：AI倾向于「先实现，后测试」，而且补的测试往往只覆盖happy path；AI在多轮对话后会逐渐丢失早期约束，悄悄引入新的架构决策；AI生成的代码量大且自信，导致Code Review从「评审设计」变成了「排雷」；需求和代码之间没有可追踪的映射关系，也无法回答「这段代码对应哪个需求」的问题。

这一系列问题没有否定AI编程的价值，但让严肃的工程团队开始思考：能不能把AI的生产力和工程的纪律结合起来？

### Amazon Kiro：商业产品接棒，SDD走向主流IDE（2025年7月）

Amazon AWS于2025年7月发布了Kiro的预览版。Kiro的定位是一款完整的AI IDE，核心卖点正是规格驱动开发。

Kiro的核心机制是在开始编码前自动生成三份「活文档」：需求文档（requirements.md）、系统设计文档（design.md）和任务清单（tasks.md）。这些文档会随代码演进同步更新，不是一次性的静态文档，而是真正贯穿整个开发生命周期的活跃资产。

Kiro的Hooks机制监听代码变更并自动触发规格更新，这解决了「规格文档最终变成废纸」的痛点——这个问题在传统文档工具里几乎无解。AWS的商业背书，让SDD从开源社区的实验性探索，走向了企业级开发工具的主流视野。

### GitHub Spec Kit：官方入场，SDD概念正式成型（2025年9月）

2025年9月8日，GitHub官方发布了Spec Kit，正式提出了**Specification-Driven Development（规格驱动开发，SDD）**的完整概念框架。

GitHub Blog发文明确宣告了这个概念的核心主张：

> "For decades, code has been king. Specifications served code—they were the scaffolding we built and then discarded once the 'real work' of coding began. Spec-Driven Development inverts this power relationship: specifications are no longer the input to development, they are development."

长期以来，PRD、设计文档、架构图都只是「辅助scaffolding」——写完就扔，真正重要的是代码。Spec Kit的立场是：在AI编程时代，这个逻辑必须反转——规格本身就是开发的核心产物，代码是规格的执行结果。

Spec Kit的工具链包含几个核心命令：`/speckit.constitution`（定义工程原则）、`/speckit.specify`（沉淀需求和验收标准）、`/speckit.clarify`（澄清模糊点）、`/speckit.plan`（制定技术方案）、`/speckit.tasks`（拆解可执行任务）、`/speckit.analyze`（检查一致性）、`/speckit.implement`（进入实现）。

发布一个月内获得约2.8万颗星，截至2026年4月累计超过9万颗星。Spec Kit与工具无关，同时支持Claude Code、GitHub Copilot、Cursor、Windsurf、Gemini CLI等所有主流AI编程工具。

### Superpowers 出现：给AI编程Agent套上工程框架（2025年10月）

Jesse Vincent（GitHub ID: obra）在2025年10月发布了第一个版本的Superpowers。

Superpowers的出发点很朴素：AI Agent最大的问题不是不聪明，而是没有工程习惯。一个不受约束的AI Agent，就像一个能力很强但行事鲁莽的实习生——它会直接扑上去写代码，跳过需求澄清、跳过设计讨论、跳过测试，完成后也不会主动检查是否符合原始要求。

Superpowers为AI Agent提供一套**可组合的技能（Skills）**，每个技能是一段精心设计的Prompt，约束AI在特定阶段应该怎么工作。核心技能包括：**Brainstorming**（开工前先澄清需求）、**TDD**（强制先写失败测试再实现）、**Review**（完成后对照需求做代码审查）、**Verification**（完成前系统性检查交付状态）。

这些技能背后有工程学层面的设计考量，开发者引用了「说服心理学」：仅仅告诉AI「你应该做什么」是不够的，还需要告诉它「为什么这样做对工程有益」，这样AI才会真正遵守，而不是在其他指令的压力下绕过约束。

Superpowers发布后增长异常迅速：最初几千星，几个月后突破2.7万，到2026年3月突破12万星，成为史上增长最快的AI编程辅助工具之一。Anthropic官方将其收录进Claude Code的推荐资源库——主流AI平台开始认可「工程纪律约束框架」这条路线的价值。

---

## 二、竞品对比：SDD赛道上的五种玩家

### Spec Kit + Superpowers（GitHub + Jesse Vincent）

这是目前在开源社区影响力最大的「双层」方案。分工非常清晰：Spec Kit负责「应该构建什么」，Superpowers负责「应该如何构建」。

核心优势在于工具无关性——它可以叠加在任何AI编程环境上，而不是绑定某款工具。GitHub官方背书保证了文档质量和长期维护。Superpowers的技能设计有工程学深度，不只是Prompt模板，而是有方法论支撑的工作流约束。

主要劣势是需要手动安装和配置，有学习曲线；规格文档与代码的同步更新依赖开发者主动维护，自动化程度不如Kiro。

社区普遍反馈：Superpowers的最大价值是「逼着AI在正式写代码前先讨论设计」——哪怕只用到Brainstorming这一个技能，对代码质量的提升也是立竿见影的。Spec Kit的Constitution命令被很多团队用来解决「AI每次对话都重新发明架构」的问题。

### Amazon Kiro

Kiro是商业SDD方案的代表。它把「需求文档优先」的逻辑做进了IDE本身，活文档机制是真正的差异化能力——文档自动随代码变更更新，从根本上解决了「规格文档最终变成废纸」的行业痛点。

但Kiro与VS Code深度绑定，对快速迭代的小团队可能显得「太正式了」——它更适合需求相对明确的工程类项目。商业产品的定价和数据隐私也是企业决策时需要考量的因素。

### Cursor + OpenSpec

Cursor是目前AI编程工具市占率最高的产品之一。它自身不是SDD工具，但.cursorrules文件支持用户定义工程约束，社区演化出了把Spec Kit工作流接入Cursor的方案（OpenSpec等）。

.cursorrules的本质是静态文本——AI可以「读到」这些规则，但不一定真正遵守，随着对话变长，规则被遵守的概率会下降。很多团队把Cursor和Spec Kit结合使用，让前者处理代码实现，后者管理规格上下文。

### Claude Code + CLAUDE.md + Superpowers

Claude Code是Anthropic于2025年推出的CLI编程工具。CLAUDE.md文件天然成为了一种轻量级SDD工具——将Constitution和Specify的内容写入其中，基本就能实现Spec Kit的核心价值。

Claude Code对CLAUDE.md的遵守程度明显高于Cursor对.cursorrules的遵守程度，这与其Agent工作流的设计有关。与Superpowers的组合是目前社区口碑最好的「高纪律AI编程」方案，Anthropic官方认可也为长期支持提供了信号。

### Devin 和全自动Agent

Devin（Cognition AI）代表了另一个极端：完全自主的AI软件工程师，从需求到PR完全自动化。SWE-bench评测中，Devin曾以最高的解题率引发业界震动。

但真实使用报告显示：Devin在完全自由模式下会做出各种「看似合理但不是你要的」决策；对大型复杂代码库的理解能力有上限；对于需要多轮人工决策的工程任务，全自动反而增加了返工成本。

这个对比揭示了一个反直觉的结论：**最「聪明」的AI Agent，不一定最适合严肃工程。** 工程质量的核心不是生成能力，而是对需求的准确理解和对约束的持续遵守——这正是SDD工具链试图解决的问题。

---

## 三、综合判断

### 这不是AI是否够强的问题，而是开发范式的问题

回顾这个领域的演进脉络，有一个反直觉的结论浮出水面：**AI能力的提升，反而让工程规范变得更重要，而不是更不重要。**

2022年Copilot刚出来的时候，它只能补全几行代码，开发者始终掌握全局上下文，AI犯错的代价很低。但当AI能够在几秒内生成几百行代码、自主决定架构结构、独立完成一个功能的实现时，「让AI自由发挥」的风险就被放大了同等倍数。

Vibe Coding的热潮说明了一件事：大量开发者意识到了速度的可能性，但还没有意识到控制权的必要性。Spec Kit、Superpowers、Kiro的相继出现，标志着这个认知正在迅速成熟。

### Spec Kit + Superpowers 的组合为什么值得认真对待

在所有竞品中，这个组合的设计哲学是最接近「真实工程团队应该如何工作」的。

Spec Kit解决的核心问题是「规格漂移」——在多轮AI对话中，最初的需求约束会被不断稀释，最终实现的东西和最初要做的东西可能相差甚远。Constitution和Specify把关键约束显式化，让AI在每次实现前都能回到这个「北极星」。

Superpowers解决的核心问题是「流程缺失」——AI天然倾向于「直接写代码」，跳过设计讨论、测试策略和完成验收。它通过技能系统强制AI走完整个工程流程，不给跳步的机会。

两者的组合，实际上是在用「流程约束」弥补「上下文有限」的本质局限。这是一个务实且高效的工程解决方案，而不是一套需要大量工具链投入才能运转的理想主义框架。

### 局限性也需要直视

SDD的核心成本是「规格维护负担」。规格文档如果不随代码持续更新，会很快失去可信度，反而成为负担。Kiro的活文档机制试图通过自动化解决这个问题，但目前的自动化程度还有限。

另一个局限是适用场景。SDD最适合需求相对明确、代码需要长期维护的工程项目。对于探索性的Demo、需求仍在快速演变的实验，Vibe Coding依然是更高效的选择。两者不是非此即彼的对立，而是应该根据项目性质灵活切换。

### 未来走向：SDD将成为AI编程的基础设施

从历史演进来看，这个领域正在经历一条清晰的技术成熟曲线。2025年是Vibe Coding爆发、工程问题暴露的一年；2025-2026年是SDD方法论提出、工具链成形的一年；接下来很可能是SDD能力被内置进主流AI IDE、成为默认工作方式的阶段。

Amazon Kiro的商业化是一个重要信号：当大型云服务商开始把SDD作为产品核心卖点，它就不再只是一个开源社区实验，而是商业上被验证可行的方向。GitHub Copilot未来的版本内置更完整的规格管理能力、Cursor深化与Spec Kit的集成，这些演进几乎是可以预期的。

对于今天的工程团队来说，最务实的建议是：不要等工具成熟再开始，先用Spec Kit建立Constitution和Specify的习惯，用Superpowers约束AI的工作方式。这两个改变的成本极低，但对AI编程质量的提升是立竿见影的。

> **Vibe Coding给了我们速度，Spec-Driven Development给了我们控制权。两者不是对立的，而是AI辅助开发走向成熟的两个必要阶段。**

---

*本报告基于公开资料和联网搜索整理，信息时效截至2026年4月。Superpowers和Spec Kit均处于活跃迭代中，建议参考各项目的最新官方文档。*
