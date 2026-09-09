# 🎓 InsightAcademic — Simulador Estratégico de Trajetória Acadêmica

> **Bacharelado em Ciência da Computação (PPC 2023)**  
> **Universidade do Estado de Mato Grosso (UNEMAT)** — *Campus Universitário Jane Vanini (Cáceres - MT)*  
> Equipe de Concepção e Pesquisa: Izabely Kamila e Taíse Alves • Docente: Dra. Maricy Caregnato

---

## 📌 Sobre o Projeto

O **InsightAcademic** é um simulador web interativo que transforma o Projeto Pedagógico do Curso (**PPC 2023**) de Ciência da Computação da UNEMAT em um modelo de dados reativo e visual baseado em **Grafo Dirigido Aclíclico (DAG)**.

O sistema foi desenvolvido para eliminar as dores de replanejamento manual de matrículas e mitigar a falta de clareza sobre o **Efeito Cascata** e o **Caminho Crítico** decorrentes de reprovações ou trancamentos de disciplinas-chave.

---

## 🚀 Consolidação dos Feedbacks de Usabilidade (Teste com Acadêmicos)

Após a realização de testes A/B de alta fidelidade entre dois protótipos (*Lovable* vs. *v0*), o sistema consolidou os melhores aspectos de ambos:

1. **Design System Vencedor (Lovable — 80% de Preferência)**:
   - Interface moderna, inspirada em plataformas SaaS líderes (Linear, Notion, Vercel).
   - Suporte nativo completo a **Modo Escuro (Dark Mode)** e **Modo Claro (Light Mode)**.
   - Microinterações fluidas e estética limpa.
2. **Solução do Atrito de Setas Poluídas (Feedback v0)**:
   - Eliminação da sobreposição caótica de setas.
   - Implementação do **Hover Focus Inteligente**: ao passar o mouse sobre qualquer disciplina, todas as outras matérias não relacionadas têm sua opacidade reduzida a 20%, e apenas as setas dos **pré-requisitos diretos/indiretos** (em âmbar) e das **disciplinas dependentes futuras** (em roxo) são desenhadas em curvas Bézier dinâmicas com efeito de brilho (*glow*).
   - Botão seletor no menu para alternar entre "Foco Inteligente" e "Todas as Conexões".
3. **Esclarecimento do Semáforo Amarelo (Solução para 40% das dúvidas)**:
   - Legenda fixa na barra superior com badges explícitos e tooltips detalhados:
     - 🟩 **Aprovado (Verde)**: Disciplina já integralizada no histórico.
     - 🟨 **Liberado para Cursar (Amarelo)**: Todos os pré-requisitos cumpridos; pronta para matrícula no semestre letivo.
     - 🟥 **Bloqueado (Vermelho)**: Possui pré-requisitos pendentes; trancada com ícone de cadeado.
     - 🟧 **Refazer (Laranja)**: Matéria marcada para ser recursada.
4. **Incorporação dos Indicadores Analíticos do v0**:
   - **Dashboard Dinâmico**: Carga Horária Aprovada vs. Pendente (base 3.200h), % de Integralização e Semestres Estimados via Caminho Crítico.
   - **Ficha Técnica & Teto Máximo de Faltas**: Exibição da carga horária e do limite legal de 25% de faltas permitidas em cada disciplina.
5. **Menu Lateral Estratégico (Maior Impacto & % das Trilhas)**:
   - **Disciplinas de Maior Impacto**: Destaque dinâmico das disciplinas que bloqueiam mais matérias dependentes ou possuem maior profundidade no grafo, com badge de cadeados e clique para focar instantaneamente no grafo.
   - **Porcentagem de Cada Trilha**: Acompanhamento em tempo real da % de conclusão de cada trilha do conhecimento (Matemática, Hardware, Banco de Dados, Redes, Software, etc.) com barras de progresso dedicadas e lista expansível de disciplinas.
   - **Fase Atual & Sazonalidade**: Seletor rápido de fase (1ª a 8ª) e filtro de sazonalidade (Todas, Ímpares, Pares) diretamente no menu lateral.
6. **Slide-Over Drawer de Impacto Imediato ("Efeito Dominó")**:
   - Painel lateral que exibe em tempo real a lista de matérias destravadas por uma aprovação ou a cascata de bloqueios gerada por uma reprovação, além do cálculo de atraso em semestres na formatura.
7. **Onboarding Wizard de 2 Etapas**:
   - Início manual limpo ou seleção rápida por Semestre Atual (aprovando automaticamente semestres anteriores e liberando a fase vigente).
8. **Exportação do Plano de Estudos em PDF / Impressão Formatada**:
   - Resumo oficial com cabeçalho institucional da UNEMAT Jane Vanini, pronto para visualização, salvamento em PDF e impressão.

---

## 🛠️ Tech Stack

- **Linguagem & Framework**: React 18, TypeScript, Vite
- **Estilização**: Tailwind CSS (com classes semafóricas customizadas, animações e glassmorphism)
- **Ícones**: Lucide React
- **Arquitetura de Estado**: Global Context Store (`useAcademicStore`) com suporte a histórico e **Undo (Desfazer)**
- **Motor de Grafo**: DAG recursivo próprio (`graphEngine.ts`) com cálculo em cascata e caminho crítico em tempo real

---

## 💻 Como Rodar o Projeto Localmente

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/Isight-Academy.git

# 2. Acesse a pasta do projeto
cd Isight-Academy

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev

# 5. Para gerar o build de produção
npm run build
```

---

## 📐 Estrutura do Código

```
Isight-Academy/
├── src/
│   ├── types/
│   │   └── academic.ts          # Tipagens de disciplinas, estados semafóricos e métricas
│   ├── data/
│   │   └── curriculumPPC2023.ts # Matriz oficial de 8 semestres do PPC 2023 UNEMAT
│   ├── lib/
│   │   └── graphEngine.ts       # Motor matemático de DAG, caminho crítico e cascata
│   ├── store/
│   │   └── useAcademicStore.tsx # Estado centralizado, histórico de undo e simulações
│   ├── components/
│   │   ├── header/
│   │   │   ├── Navbar.tsx       # Controles globais, tema e exportação
│   │   │   ├── MetricsBar.tsx   # Dashboard analítico de horas e integralização
│   │   │   └── FiltersBar.tsx   # Busca instantânea, filtros e legenda semafórica fixa
│   │   ├── graph/
│   │   │   ├── CurriculumGraph.tsx  # Contêiner de rolagem com overlay de conexões
│   │   │   ├── SemesterColumn.tsx   # Coluna de semestre individual
│   │   │   ├── SubjectCard.tsx      # Card de disciplina com hover focus e popover
│   │   │   └── GraphConnections.tsx # Renderizador de setas curvas SVG dinâmicas
│   │   ├── drawer/
│   │   │   └── ImpactDrawer.tsx     # Painel lateral do Efeito Dominó
│   │   └── modals/
│   │       ├── OnboardingModal.tsx  # Wizard de inicialização em 2 etapas
│   │       ├── SubjectDetailsModal.tsx # Ficha técnica com teto de faltas e ementa
│   │       └── ExportPlanModal.tsx  # Impressão e PDF do plano de estudo
│   ├── App.tsx
│   └── main.tsx
```
