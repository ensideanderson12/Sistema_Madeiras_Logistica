// Sistema Madeiras Logística - Main JavaScript
class SistemaMadeirasLogistica {
    constructor() {
        this.currentSection = 'dashboard';
        this.operationData = {
            route: {
                origin: 'Mandirituba/PR',
                destination: 'Rio Pomba/MG',
                distance: 1319,
                freight: 11000
            },
            products: {
                pinusConvencional: {
                    volume: 28,
                    price: 1170,
                    dimensions: '2,0 x 30 x 3,00'
                },
                pinusSeco: {
                    volume: 24,
                    price: 950,
                    variations: [7, 7, 5, 5]
                }
            },
            totalVolume: 52,
            avgWeight: 500, // kg/m³
            freightPerM3: 211.54
        };
        this.init();
    }

    init() {
        this.setupNavigation();
        this.updateCurrentDate();
        this.calculateTotals();
        this.loadSectionContent();
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = link.getAttribute('href').substring(1);
                this.switchSection(targetSection);
            });
        });
    }

    switchSection(sectionId) {
        // Remove active class from all sections and nav links
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to target section and nav link
        const targetSection = document.getElementById(sectionId);
        const targetNavLink = document.querySelector(`a[href="#${sectionId}"]`);
        
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;
        }
        
        if (targetNavLink) {
            targetNavLink.classList.add('active');
        }

        // Load section-specific content
        this.loadSectionContent();
    }

    updateCurrentDate() {
        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            const now = new Date();
            const formatted = now.toLocaleString('pt-BR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
            dateElement.textContent = formatted;
        }
    }

    calculateTotals() {
        const { products } = this.operationData;
        
        // Calculate individual totals
        const pinusConvTotal = products.pinusConvencional.volume * products.pinusConvencional.price;
        const pinusSecoTotal = products.pinusSeco.volume * products.pinusSeco.price;
        const totalProducts = pinusConvTotal + pinusSecoTotal;
        const averagePrice = totalProducts / this.operationData.totalVolume;

        // Update DOM elements
        this.updateElement('pinus-conv-total', this.formatCurrency(pinusConvTotal));
        this.updateElement('pinus-seco-total', this.formatCurrency(pinusSecoTotal));
        this.updateElement('total-products', this.formatCurrency(totalProducts));
        this.updateElement('total-logistics', this.formatCurrency(this.operationData.route.freight));
        this.updateElement('average-price', `R$ ${averagePrice.toFixed(2)}/m³`);

        // Calculate transparent margin
        const totalCost = totalProducts + this.operationData.route.freight;
        const margin = ((totalCost * 0.15) / totalCost * 100).toFixed(1);
        this.updateElement('transparent-margin', `${margin}%`);
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    loadSectionContent() {
        switch (this.currentSection) {
            case 'calculadora':
                this.loadCalculatorContent();
                break;
            case 'logistica':
                this.loadLogisticsContent();
                break;
            case 'comparativo':
                this.loadComparativeContent();
                break;
        }
    }

    loadCalculatorContent() {
        const container = document.querySelector('#calculadora .container');
        if (!container) return;

        container.innerHTML = `
            <h2>🧮 Calculadora Transparência Total</h2>
            <div class="calculator-container">
                <h3>📊 Simulação de Transparência - Operação Curitiba-RJ</h3>
                
                <div class="form-grid">
                    <div class="input-group">
                        <label for="volume-fornecedor">Volume Fornecedor (m³):</label>
                        <input type="number" id="volume-fornecedor" value="52" step="0.1">
                    </div>
                    
                    <div class="input-group">
                        <label for="preco-base">Preço Base Fornecedor (R$/m³):</label>
                        <input type="number" id="preco-base" value="1060" step="1">
                    </div>
                    
                    <div class="input-group">
                        <label for="distancia">Distância (km):</label>
                        <input type="number" id="distancia" value="1319" step="1">
                    </div>
                    
                    <div class="input-group">
                        <label for="custo-frete">Custo Frete (R$):</label>
                        <input type="number" id="custo-frete" value="11000" step="100">
                    </div>
                    
                    <div class="input-group">
                        <label for="margem-transparente">Margem Transparente (%):</label>
                        <input type="number" id="margem-transparente" value="15" step="1" min="5" max="30">
                    </div>
                    
                    <div class="input-group">
                        <label for="divisao-lucro">Divisão Lucro Fornecedor (%):</label>
                        <input type="number" id="divisao-lucro" value="70" step="5" min="50" max="80">
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="sistemaLogistica.calculateTransparency()">
                    🔍 Calcular Transparência
                </button>
                
                <div id="transparency-results" class="calculation-results" style="display: none;">
                    <!-- Results will be populated here -->
                </div>
            </div>
            
            <div class="calculator-container">
                <h3>💰 Comparativo: Modelo Tradicional vs Transparente</h3>
                <div id="model-comparison">
                    <!-- Comparison will be populated here -->
                </div>
            </div>
        `;
    }

    calculateTransparency() {
        const volume = parseFloat(document.getElementById('volume-fornecedor').value);
        const precoBase = parseFloat(document.getElementById('preco-base').value);
        const distancia = parseFloat(document.getElementById('distancia').value);
        const custoFrete = parseFloat(document.getElementById('custo-frete').value);
        const margemTransparente = parseFloat(document.getElementById('margem-transparente').value);
        const divisaoLucro = parseFloat(document.getElementById('divisao-lucro').value);

        // Calculations
        const valorBaseFornecedor = volume * precoBase;
        const custoTotalOperacao = valorBaseFornecedor + custoFrete;
        const margemAplicada = custoTotalOperacao * (margemTransparente / 100);
        const precoFinalCliente = custoTotalOperacao + margemAplicada;
        const lucroExcedente = margemAplicada;
        const lucroFornecedor = lucroExcedente * (divisaoLucro / 100);
        const lucroSistema = lucroExcedente * ((100 - divisaoLucro) / 100);
        const precoFinalPorM3 = precoFinalCliente / volume;
        const custoFretePorKm = custoFrete / distancia;

        // Display results
        const resultsContainer = document.getElementById('transparency-results');
        resultsContainer.style.display = 'block';
        resultsContainer.innerHTML = `
            <h4>📋 Resultados da Análise de Transparência</h4>
            
            <div class="result-item">
                <span class="result-label">Valor Base Fornecedor:</span>
                <span class="result-value">${this.formatCurrency(valorBaseFornecedor)}</span>
            </div>
            
            <div class="result-item">
                <span class="result-label">Custo Logístico:</span>
                <span class="result-value">${this.formatCurrency(custoFrete)}</span>
            </div>
            
            <div class="result-item">
                <span class="result-label">Custo Total Operação:</span>
                <span class="result-value">${this.formatCurrency(custoTotalOperacao)}</span>
            </div>
            
            <div class="result-item">
                <span class="result-label">Margem Transparente (${margemTransparente}%):</span>
                <span class="result-value">${this.formatCurrency(margemAplicada)}</span>
            </div>
            
            <div class="result-item">
                <span class="result-label">Preço Final ao Cliente:</span>
                <span class="result-value">${this.formatCurrency(precoFinalCliente)}</span>
            </div>
            
            <div class="result-item">
                <span class="result-label">Preço por m³ (Cliente):</span>
                <span class="result-value">R$ ${precoFinalPorM3.toFixed(2)}/m³</span>
            </div>
            
            <div class="result-item">
                <span class="result-label">Custo Frete por km:</span>
                <span class="result-value">R$ ${custoFretePorKm.toFixed(2)}/km</span>
            </div>
            
            <hr style="margin: 1rem 0;">
            
            <div class="result-item">
                <span class="result-label">💰 Lucro Fornecedor (${divisaoLucro}%):</span>
                <span class="result-value">${this.formatCurrency(lucroFornecedor)}</span>
            </div>
            
            <div class="result-item">
                <span class="result-label">🏢 Lucro Sistema (${100-divisaoLucro}%):</span>
                <span class="result-value">${this.formatCurrency(lucroSistema)}</span>
            </div>
            
            <div class="result-item" style="background: #e8f5e8; padding: 1rem; border-radius: 5px;">
                <span class="result-label">🎯 Total Receita Fornecedor:</span>
                <span class="result-value">${this.formatCurrency(valorBaseFornecedor + lucroFornecedor)}</span>
            </div>
        `;

        // Show comparison
        this.showModelComparison(valorBaseFornecedor, lucroFornecedor, precoFinalCliente);
    }

    showModelComparison(valorBase, lucroFornecedor, precoFinal) {
        const comparisonContainer = document.getElementById('model-comparison');
        
        // Simulate traditional model (less transparency, lower supplier profit)
        const margemTradicional = precoFinal * 0.25; // 25% traditional margin
        const lucroTradicionalFornecedor = margemTradicional * 0.30; // 30% to supplier
        const receitaTradicional = valorBase + lucroTradicionalFornecedor;
        const receitaTransparente = valorBase + lucroFornecedor;
        const vantagem = receitaTransparente - receitaTradicional;
        const percentualVantagem = ((vantagem / receitaTradicional) * 100).toFixed(1);

        comparisonContainer.innerHTML = `
            <div class="comparison-grid">
                <div class="comparison-card">
                    <h4>📊 Modelo Tradicional</h4>
                    <div class="comparison-item">
                        <span class="comparison-label">Margem Praticada:</span>
                        <span class="comparison-value">25%</span>
                    </div>
                    <div class="comparison-item">
                        <span class="comparison-label">Transparência:</span>
                        <span class="comparison-value">Limitada</span>
                    </div>
                    <div class="comparison-item">
                        <span class="comparison-label">Receita Fornecedor:</span>
                        <span class="comparison-value">${this.formatCurrency(receitaTradicional)}</span>
                    </div>
                    <div class="comparison-item">
                        <span class="comparison-label">Autonomia Fornecedor:</span>
                        <span class="comparison-value">Baixa</span>
                    </div>
                </div>
                
                <div class="comparison-card">
                    <h4>🚀 Modelo Transparente</h4>
                    <div class="comparison-item">
                        <span class="comparison-label">Margem Praticada:</span>
                        <span class="comparison-value">15%</span>
                    </div>
                    <div class="comparison-item">
                        <span class="comparison-label">Transparência:</span>
                        <span class="comparison-value">Total</span>
                    </div>
                    <div class="comparison-item">
                        <span class="comparison-label">Receita Fornecedor:</span>
                        <span class="comparison-value">${this.formatCurrency(receitaTransparente)}</span>
                    </div>
                    <div class="comparison-item">
                        <span class="comparison-label">Autonomia Fornecedor:</span>
                        <span class="comparison-value">Máxima</span>
                    </div>
                </div>
            </div>
            
            <div class="alert alert-success">
                <strong>🎯 Vantagem Modelo Transparente:</strong><br>
                O fornecedor recebe <strong>${this.formatCurrency(vantagem)}</strong> a mais (+${percentualVantagem}%) 
                com total transparência de custos e manutenção de sua autonomia.
            </div>
        `;
    }

    loadLogisticsContent() {
        const container = document.querySelector('#logistica .container');
        if (!container) return;

        container.innerHTML = `
            <h2>🚛 Módulo Logística Inteligente</h2>
            
            <div class="route-optimizer">
                <h3>🗺️ Otimização de Rota: Mandirituba/PR → Rio Pomba/MG</h3>
                
                <div class="route-info">
                    <div class="route-detail">
                        <h4>📍 Distância</h4>
                        <div class="route-value">1.319 km</div>
                    </div>
                    <div class="route-detail">
                        <h4>💰 Frete Atual</h4>
                        <div class="route-value">R$ 11.000</div>
                    </div>
                    <div class="route-detail">
                        <h4>📊 Custo/km</h4>
                        <div class="route-value">R$ 8,33</div>
                    </div>
                    <div class="route-detail">
                        <h4>⏱️ Tempo Estimado</h4>
                        <div class="route-value">18h</div>
                    </div>
                </div>
                
                <div class="alert alert-info">
                    <strong>📈 Análise de Eficiência:</strong> 
                    A rota atual apresenta custo competitivo de R$ 8,33/km, 
                    abaixo da média nacional de R$ 10,50/km para cargas similares.
                </div>
                
                <h4>🚛 Transportadoras Qualificadas</h4>
                <div class="transportadoras-list">
                    <div class="transportadora-item">
                        <div class="transportadora-info">
                            <h5>TransLog Sul-Sudeste</h5>
                            <p>Especializada em madeiras • 15 anos experiência</p>
                        </div>
                        <div class="transportadora-price">R$ 10.800</div>
                    </div>
                    
                    <div class="transportadora-item">
                        <div class="transportadora-info">
                            <h5>Madeira Express</h5>
                            <p>Frota própria • Seguro total</p>
                        </div>
                        <div class="transportadora-price">R$ 11.200</div>
                    </div>
                    
                    <div class="transportadora-item">
                        <div class="transportadora-info">
                            <h5>Rota Verde Transportes</h5>
                            <p>Sustentável • Rastreamento real-time</p>
                        </div>
                        <div class="transportadora-price">R$ 11.500</div>
                    </div>
                </div>
                
                <button class="btn btn-success">📊 Simular Rotas Alternativas</button>
                <button class="btn btn-secondary">📞 Solicitar Cotações</button>
            </div>
        `;
    }

    loadComparativeContent() {
        const container = document.querySelector('#comparativo .container');
        if (!container) return;

        container.innerHTML = `
            <h2>📈 Sistema de Análise Comparativa</h2>
            
            <div class="comparison-grid">
                <div class="comparison-card">
                    <h4>🌲 Análise por Produto</h4>
                    <div class="comparison-item">
                        <span class="comparison-label">Pinus Convencional:</span>
                        <span class="comparison-value">R$ 1.170/m³</span>
                    </div>
                    <div class="comparison-item">
                        <span class="comparison-label">Pinus Seco:</span>
                        <span class="comparison-value">R$ 950/m³</span>
                    </div>
                    <div class="comparison-item">
                        <span class="comparison-label">Diferencial Secagem:</span>
                        <span class="comparison-value">+23,2%</span>
                    </div>
                    <div class="comparison-item">
                        <span class="comparison-label">Volume Ótimo:</span>
                        <span class="comparison-value">52 m³</span>
                    </div>
                </div>
                
                <div class="comparison-card">
                    <h4>🚛 Análise Logística</h4>
                    <div class="comparison-item">
                        <span class="comparison-label">Custo Atual:</span>
                        <span class="comparison-value">R$ 8,33/km</span>
                    </div>
                    <div class="comparison-item">
                        <span class="comparison-label">Média Nacional:</span>
                        <span class="comparison-value">R$ 10,50/km</span>
                    </div>
                    <div class="comparison-item">
                        <span class="comparison-label">Economia:</span>
                        <span class="comparison-value">-20,7%</span>
                    </div>
                    <div class="comparison-item">
                        <span class="comparison-label">Eficiência:</span>
                        <span class="comparison-value">Excelente</span>
                    </div>
                </div>
                
                <div class="comparison-card">
                    <h4>💰 Divisão de Lucro</h4>
                    <div class="comparison-item">
                        <span class="comparison-label">Fornecedor:</span>
                        <span class="comparison-value">70%</span>
                    </div>
                    <div class="comparison-item">
                        <span class="comparison-label">Sistema:</span>
                        <span class="comparison-value">30%</span>
                    </div>
                    <div class="profit-sharing-visual"></div>
                    <div class="comparison-item">
                        <span class="comparison-label">Transparência:</span>
                        <span class="comparison-value">100%</span>
                    </div>
                </div>
            </div>
            
            <div class="calculator-container">
                <h3>📊 Impacto da Distância nos Custos</h3>
                <div id="distance-impact">
                    <canvas id="distance-chart" width="400" height="200"></canvas>
                </div>
                <p><em>Gráfico mostra a relação custo-benefício por faixa de distância para operações similares.</em></p>
            </div>
            
            <div class="alert alert-success">
                <strong>🎯 Resumo Estratégico:</strong><br>
                A operação Curitiba-RJ apresenta excelente viabilidade com custos 
                otimizados e modelo de transparência total que beneficia todas as partes.
            </div>
        `;
    }
}

// Initialize system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.sistemaLogistica = new SistemaMadeirasLogistica();
});