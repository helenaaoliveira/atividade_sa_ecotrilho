# PLANO DE IMPLEMENTAÇÃO

### 1. Identificação e visão geral

#### Integrantes do grupo:
Gustavo Raasch, 
Helena de Oliveira, 
João Santos e 
Rafaela Mafra

#### Mockup:
Mobile: https://canva.link/0d6t4vr35m97l49 

Desktop: https://canva.link/jzg7mnsal2294sn

#### Resumo do sistema:
O Ferrorama é um sistema de monitoramento ferroviário desenvolvido para acompanhar o desempenho da frota de trens em tempo real. O sistema permite visualizar informações sobre trens, sensores, relatórios e usuários, facilitando o trabalho de operadores, técnicos e administradores. Seu diferencial é centralizar todas as informações em uma interface simples, moderna e responsiva, acessível tanto em dispositivos móveis quanto em computadores.

#### Decisões Técnicas:
-HTML
Utilizaremos HTML para estruturar as páginas do sistema de forma semântica e organizada.

-CSS
Será utilizado CSS puro para garantir maior controle sobre a aparência da interface e fidelidade ao mockup desenvolvido.

-JavaScript
Será utilizado JavaScript puro para implementar validações, navegação entre telas, filtros, autenticação simulada e manipulação dinâmica de dados.

-Frameworks
Não serão utilizados frameworks nesta etapa do projeto. A escolha foi feita para fortalecer o aprendizado dos conceitos fundamentais de desenvolvimento web.

### 2. Arquitetura de Arquivos e Pastas

ferrorama/|-index.html
pages/|-dashboard.html|-trens.html|-sensores.html|-relatorios.html|-usuarios.html|-configuracoes.html|-cadastro.html|-recuperar-senha.html
css/|-style.css
js/|-auth.js|-dashboard.js|-trens.js|-sensores.js|-relatorios.js|-usuarios.js|-main.js|-configuracoes.js
assets/|-logo.png

#### Justificativa:
A separação dos arquivos facilita a manutenção do projeto e evita códigos excessivamente grandes. Os arquivos CSS foram divididos entre estilos gerais e componentes reutilizáveis. Os arquivos JavaScript foram separados por funcionalidade para facilitar futuras correções e melhorias. Os recursos visuais foram agrupados na pasta assets para manter a organização.

### 3. Componentes Reutilizáveis Identificados

#### Componente:
  1. Botão Primário
  2. Campo de Entrada
  3. Sidebar
  4. Card Informativo
  5. Tabela
  6. Badge de Status
  7. Modal de Confirmação
  8. Cabeçalho

#### Telas em que aparece:
  1. Login, Cadastro, Relatórios, Usuários
  2. Login, Cadastro, Relatórios
  3. Dashboard, Trens, Sensores, Relatórios, Usuários
  4. Dashboard, Trens, Sensores
  5. Trens, Sensores, Usuários, Relatórios
  6. Dashboard, Trens, Usuários
  7. Usuários, Trens
  8. Todas as páginas internas

#### Variações observadas:
  1. Normal, Hover, Desabilitado
  2. Vazio, Preenchido, Erro
  3. Item ativo e inativo
  4. Com status e alerta
  5. Diferentes colunas
  6. Ativo, Manutenção, Parado, Inativo
  7. Confirmar ou cancelar ação
  8. Título e ações


### 4. Ordem de Implementação

#### Etapa 1 – Estrutura Base
Desenvolvimento da estrutura HTML principal, configuração de pastas e criação dos arquivos do projeto.
#### Etapa 2 – Componentes Reutilizáveis
Criação dos botões, inputs, sidebar, cards e tabelas, pois serão utilizados em várias telas.
#### Etapa 3 – Sistema de Autenticação
Implementação das telas de Login e Cadastro, incluindo validações e controle de acesso.
#### Etapa 4 – Dashboard
Desenvolvimento da página principal, responsável por apresentar os indicadores gerais do sistema.
#### Etapa 5 – Trens e Sensores
Implementação das páginas de monitoramento, pois dependem da navegação criada anteriormente.
#### Etapa 6 – Relatórios
Desenvolvimento dos filtros, gráficos e geração de relatórios.
#### Etapa 7 – Usuários
Implementação das funções de cadastro, edição e gerenciamento de usuários.
#### Etapa 8 – Testes e Correções
Validação geral do sistema, correção de erros e ajustes de responsividade.
