# 🌦️ Sistema de Nowcasting Meteorológico com Sensores Distribuídos

## 📌 Visão Geral

Este projeto implementa um sistema de **previsão meteorológica de curtíssimo prazo (nowcasting)** baseado em uma rede de estações meteorológicas distribuídas em uma cidade.

O objetivo não é prever o clima global ou de longo prazo, mas sim modelar o comportamento local da atmosfera usando:

- Séries temporais multivariadas  
- Estrutura espacial entre sensores  
- Aproximações físicas (transporte/advecção)  
- Redes neurais  

---

## 🎯 Objetivos

### ✔ Previsão de curtíssimo prazo
- 10 minutos  
- 30 minutos  
- 60 minutos  

### ✔ Detecção de eventos
- Chuva iminente  
- Queda brusca de temperatura  
- Rajadas de vento  

---

## 🧠 Fundamentação

A atmosfera local pode ser aproximada como um sistema dinâmico onde variáveis físicas se propagam no espaço ao longo do tempo.

Modelo físico simplificado:

\[
\frac{\partial \phi}{\partial t} + \vec{v} \cdot \nabla \phi = 0
\]

Onde:
- \(\phi\): variável (temperatura, umidade, etc.)
- \(\vec{v}\): campo de vento

Isso representa **advecção**, ou seja, transporte de informação no fluido.

---

## 🧩 Estrutura dos Dados

Cada estação fornece:

\[
x_i(t) = [T, H, P, V, chuva]
\]

- T: temperatura  
- H: umidade  
- P: pressão  
- V: velocidade do vento  
- chuva: precipitação  

### Entrada do modelo

- Últimas 1–3 horas de dados  
- Todas as estações  

---

## 🌐 Modelagem Espacial

As estações são modeladas como um **grafo**:

- Nó: estação  
- Aresta: proximidade/influência  

Matriz de adjacência:

\[
A_{ij} = e^{-d_{ij}/\sigma}
\]

- \(d_{ij}\): distância entre estações  
- \(\sigma\): parâmetro de escala  

---

## ⚙️ Arquitetura do Modelo

### 🔹 Opção 1 — LSTM + Features Espaciais
- Entrada concatenada de todas as estações  
- Features adicionais:
  - distância  
  - direção do vento  

---

### 🔹 Opção 2 — GNN + LSTM (Recomendado)

Pipeline:

1. **Graph Neural Network (GNN)**  
   - Propaga informação entre estações  

2. **LSTM**  
   - Modela evolução temporal  

---

### 🔹 Opção 3 — Modelo Híbrido Físico + IA

Aproximação:

\[
\phi_i(t+\Delta t) \approx \phi_j(t)
\]

- \(j\): estação a montante (upwind)  

Utiliza vento para estimar transporte de informação.

---

## 📊 Saídas do Modelo

### ✔ Regressão
- Valores futuros das variáveis (T, H, P, etc.)

### ✔ Classificação (eventos)
- Chuva (0/1)  
- Rajada (> limiar)  
- Queda brusca de temperatura  

→ Abordagem: **multi-task learning**

---

## 🔄 Pipeline do Sistema

1. Coleta de dados (estações, 1 min)
2. Pré-processamento:
   - normalização  
   - sincronização  
   - tratamento de dados faltantes  
3. Engenharia de features:
   - médias móveis  
   - gradientes temporais  
   - diferenças espaciais  
4. Treinamento do modelo
5. Inferência:
   - previsões  
   - detecção de eventos  

---

## 🔥 Diferencial do Projeto

O principal ganho não está apenas na rede neural, mas na **incorporação de conhecimento físico**:

- Direção do vento  
- Propagação espacial  
- Correlação entre estações  
- Tempo de atraso entre sinais  

---

## 🧠 Insight Central

O sistema não resolve explicitamente as equações físicas da atmosfera.

Em vez disso, ele aprende uma aproximação de:

> Transporte de informação em um fluido

---

## 🚀 Possíveis Extensões

- Estimar velocidade de propagação via correlação cruzada  
- Modelagem explícita de atraso temporal entre estações  
- Integração com dados externos (ex: modelos globais)  
- Uso de ConvLSTM ou CNN 3D  

---

## 📌 Conclusão

Este projeto implementa um:

> Modelo espaço-temporal para nowcasting meteorológico com detecção de eventos baseado em sensores distribuídos

Aplicável em:
- cidades inteligentes  
- agricultura de precisão  
- monitoramento climático local  

---

## 🧪 Próximos Passos

- Implementar cálculo de correlação cruzada entre estações  
- Estimar direção e velocidade das “ondas” de variáveis  
- Validar previsões com dados reais  

---
