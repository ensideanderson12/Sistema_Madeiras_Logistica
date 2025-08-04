// Logistics Intelligence Module
class LogisticsManager {
    constructor() {
        this.routes = {
            current: {
                origin: 'Mandirituba/PR',
                destination: 'Rio Pomba/MG',
                distance: 1319,
                estimatedTime: 18,
                mainHighways: ['BR-376', 'BR-116', 'BR-381'],
                tollCost: 285,
                fuelCost: 2640,
                driverCost: 1800,
                insuranceCost: 275
            },
            alternatives: []
        };
        
        this.transporters = [
            {
                name: 'TransLog Sul-Sudeste',
                rating: 4.8,
                experience: 15,
                specialization: 'Madeiras',
                price: 10800,
                insurance: true,
                tracking: true,
                estimatedTime: 17,
                advantages: ['Especializada em madeiras', '15 anos experiência', 'Frota própria']
            },
            {
                name: 'Madeira Express',
                rating: 4.6,
                experience: 12,
                specialization: 'Cargas Especiais',
                price: 11200,
                insurance: true,
                tracking: true,
                estimatedTime: 18,
                advantages: ['Frota própria', 'Seguro total', 'Rastreamento GPS']
            },
            {
                name: 'Rota Verde Transportes',
                rating: 4.4,
                experience: 8,
                specialization: 'Sustentável',
                price: 11500,
                insurance: true,
                tracking: true,
                estimatedTime: 19,
                advantages: ['Sustentável', 'Rastreamento real-time', 'Certificação ambiental']
            },
            {
                name: 'Logística Paraná-Minas',
                rating: 4.7,
                experience: 20,
                specialization: 'Rota Sul-Sudeste',
                price: 10900,
                insurance: true,
                tracking: false,
                estimatedTime: 17.5,
                advantages: ['20 anos experiência', 'Conhece a rota', 'Preço competitivo']
            }
        ];

        this.marketData = {
            nationalAverage: 10.5, // R$/km
            fuelPriceAverage: 5.85, // R$/liter
            tollInflation: 0.08, // 8% annually
            seasonalVariations: {
                high: ['Dezembro', 'Janeiro', 'Julho'], // +15%
                medium: ['Fevereiro', 'Junho', 'Novembro'], // +5%
                low: ['Março', 'Abril', 'Maio', 'Agosto', 'Setembro', 'Outubro'] // base
            }
        };
    }

    init() {
        this.calculateAlternativeRoutes();
        this.updateTransporterPrices();
        this.setupLogisticsInteractions();
    }

    calculateAlternativeRoutes() {
        // Alternative route 1: Via Belo Horizonte
        this.routes.alternatives.push({
            name: 'Via Belo Horizonte',
            origin: 'Mandirituba/PR',
            destination: 'Rio Pomba/MG',
            distance: 1385,
            estimatedTime: 19.5,
            mainHighways: ['BR-376', 'BR-381', 'BR-040'],
            advantages: ['Melhor infraestrutura', 'Mais opções de parada'],
            disadvantages: ['66 km a mais', '+1.5h tempo'],
            estimatedCost: 11550,
            costPerKm: 8.34
        });

        // Alternative route 2: Via São Paulo
        this.routes.alternatives.push({
            name: 'Via São Paulo',
            origin: 'Mandirituba/PR',
            destination: 'Rio Pomba/MG',
            distance: 1420,
            estimatedTime: 21,
            mainHighways: ['BR-376', 'BR-116', 'BR-381'],
            advantages: ['Mais postos combustível', 'Melhor sinalização'],
            disadvantages: ['101 km a mais', '+3h tempo'],
            estimatedCost: 11850,
            costPerKm: 8.35
        });

        // Alternative route 3: Direct interior route
        this.routes.alternatives.push({
            name: 'Rota Interior Direta',
            origin: 'Mandirituba/PR',
            destination: 'Rio Pomba/MG',
            distance: 1285,
            estimatedTime: 20,
            mainHighways: ['BR-373', 'BR-267', 'BR-354'],
            advantages: ['34 km menor', 'Menos pedágios'],
            disadvantages: ['Estradas secundárias', 'Menos infraestrutura'],
            estimatedCost: 10700,
            costPerKm: 8.33
        });
    }

    updateTransporterPrices() {
        const currentMonth = new Date().getMonth();
        const seasonalFactor = this.getSeasonalFactor(currentMonth);
        
        this.transporters.forEach(transporter => {
            transporter.seasonalPrice = transporter.price * seasonalFactor;
            transporter.seasonalCostPerKm = transporter.seasonalPrice / this.routes.current.distance;
        });
    }

    getSeasonalFactor(month) {
        const monthNames = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        
        const currentMonthName = monthNames[month];
        
        if (this.marketData.seasonalVariations.high.includes(currentMonthName)) {
            return 1.15; // +15%
        } else if (this.marketData.seasonalVariations.medium.includes(currentMonthName)) {
            return 1.05; // +5%
        }
        return 1.0; // Base price
    }

    setupLogisticsInteractions() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action="simulate-routes"]')) {
                this.showRouteSimulation();
            }
            
            if (e.target.matches('[data-action="request-quotes"]')) {
                this.requestQuotes();
            }
            
            if (e.target.matches('[data-action="optimize-load"]')) {
                this.showLoadOptimization();
            }
            
            if (e.target.matches('[data-action="track-costs"]')) {
                this.showCostTracking();
            }
        });
    }

    enhanceLogisticsContent() {
        const container = document.querySelector('#logistica .container');
        if (!container) return;

        container.innerHTML = `
            <h2>🚛 Módulo Logística Inteligente</h2>
            
            <div class="route-optimizer">
                <h3>🗺️ Análise de Rota: Mandirituba/PR → Rio Pomba/MG</h3>
                
                <div class="route-info">
                    <div class="route-detail">
                        <h4>📍 Distância</h4>
                        <div class="route-value">1.319 km</div>
                        <small>Rota principal</small>
                    </div>
                    <div class="route-detail">
                        <h4>💰 Frete Atual</h4>
                        <div class="route-value">R$ 11.000</div>
                        <small>Sazonal: R$ ${(11000 * this.getSeasonalFactor(new Date().getMonth())).toLocaleString('pt-BR')}</small>
                    </div>
                    <div class="route-detail">
                        <h4>📊 Custo/km</h4>
                        <div class="route-value">R$ 8,33</div>
                        <small>21% abaixo média nacional</small>
                    </div>
                    <div class="route-detail">
                        <h4>⏱️ Tempo</h4>
                        <div class="route-value">18h</div>
                        <small>Incluindo paradas</small>
                    </div>
                </div>
                
                <div class="logistics-tabs">
                    <button class="tab-btn active" data-tab="transporters">🚛 Transportadoras</button>
                    <button class="tab-btn" data-tab="routes">🗺️ Rotas Alternativas</button>
                    <button class="tab-btn" data-tab="optimization">⚡ Otimização</button>
                    <button class="tab-btn" data-tab="tracking">📊 Acompanhamento</button>
                </div>
                
                <div class="tab-content">
                    <div id="transporters-tab" class="tab-pane active">
                        ${this.renderTransportersTable()}
                    </div>
                    
                    <div id="routes-tab" class="tab-pane">
                        ${this.renderAlternativeRoutes()}
                    </div>
                    
                    <div id="optimization-tab" class="tab-pane">
                        ${this.renderOptimizationTools()}
                    </div>
                    
                    <div id="tracking-tab" class="tab-pane">
                        ${this.renderCostTracking()}
                    </div>
                </div>
            </div>
        `;

        this.setupTabSwitching();
    }

    renderTransportersTable() {
        const currentSeason = this.getSeasonalFactor(new Date().getMonth());
        
        return `
            <h4>🚛 Transportadoras Qualificadas</h4>
            <div class="transporters-comparison">
                <table class="transporters-table">
                    <thead>
                        <tr>
                            <th>Transportadora</th>
                            <th>Preço Base</th>
                            <th>Preço Sazonal</th>
                            <th>R$/km</th>
                            <th>Tempo</th>
                            <th>Avaliação</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.transporters.map(t => `
                            <tr class="transporter-row">
                                <td>
                                    <strong>${t.name}</strong><br>
                                    <small>${t.specialization} • ${t.experience} anos</small>
                                </td>
                                <td>R$ ${t.price.toLocaleString('pt-BR')}</td>
                                <td>R$ ${t.seasonalPrice.toLocaleString('pt-BR')}</td>
                                <td>R$ ${t.seasonalCostPerKm.toFixed(2)}</td>
                                <td>${t.estimatedTime}h</td>
                                <td>
                                    <div class="rating">
                                        ${'★'.repeat(Math.floor(t.rating))}${'☆'.repeat(5-Math.floor(t.rating))}
                                        <span>${t.rating}</span>
                                    </div>
                                </td>
                                <td>
                                    <button class="btn btn-sm btn-primary" onclick="logisticsManager.selectTransporter('${t.name}')">
                                        Selecionar
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="season-info">
                <h5>📅 Informação Sazonal</h5>
                <p>Fator sazonal atual: <strong>${((currentSeason - 1) * 100).toFixed(0)}%</strong></p>
                <p>Época: <strong>${this.getCurrentSeasonDescription()}</strong></p>
            </div>
        `;
    }

    renderAlternativeRoutes() {
        return `
            <h4>🗺️ Rotas Alternativas</h4>
            <div class="routes-comparison">
                <!-- Rota Atual -->
                <div class="route-card current">
                    <h5>🎯 Rota Atual (Recomendada)</h5>
                    <div class="route-details">
                        <p><strong>Distância:</strong> ${this.routes.current.distance} km</p>
                        <p><strong>Tempo:</strong> ${this.routes.current.estimatedTime}h</p>
                        <p><strong>Rodovias:</strong> ${this.routes.current.mainHighways.join(' → ')}</p>
                        <p><strong>Custo estimado:</strong> R$ 11.000</p>
                    </div>
                    <div class="route-advantages">
                        <span class="badge success">Melhor custo-benefício</span>
                        <span class="badge success">Infraestrutura adequada</span>
                    </div>
                </div>
                
                ${this.routes.alternatives.map(route => `
                    <div class="route-card alternative">
                        <h5>📍 ${route.name}</h5>
                        <div class="route-details">
                            <p><strong>Distância:</strong> ${route.distance} km 
                                <span class="difference ${route.distance > this.routes.current.distance ? 'negative' : 'positive'}">
                                    (${route.distance > this.routes.current.distance ? '+' : ''}${route.distance - this.routes.current.distance} km)
                                </span>
                            </p>
                            <p><strong>Tempo:</strong> ${route.estimatedTime}h
                                <span class="difference ${route.estimatedTime > this.routes.current.estimatedTime ? 'negative' : 'positive'}">
                                    (${route.estimatedTime > this.routes.current.estimatedTime ? '+' : ''}${(route.estimatedTime - this.routes.current.estimatedTime).toFixed(1)}h)
                                </span>
                            </p>
                            <p><strong>Rodovias:</strong> ${route.mainHighways.join(' → ')}</p>
                            <p><strong>Custo estimado:</strong> R$ ${route.estimatedCost.toLocaleString('pt-BR')}
                                <span class="difference ${route.estimatedCost > 11000 ? 'negative' : 'positive'}">
                                    (${route.estimatedCost > 11000 ? '+' : ''}R$ ${(route.estimatedCost - 11000).toLocaleString('pt-BR')})
                                </span>
                            </p>
                        </div>
                        <div class="route-advantages">
                            ${route.advantages.map(adv => `<span class="badge info">${adv}</span>`).join('')}
                        </div>
                        <div class="route-disadvantages">
                            ${route.disadvantages.map(dis => `<span class="badge warning">${dis}</span>`).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="route-actions">
                <button class="btn btn-primary" data-action="simulate-routes">🔍 Simular Todas as Rotas</button>
                <button class="btn btn-secondary">📱 Ver no Google Maps</button>
            </div>
        `;
    }

    renderOptimizationTools() {
        return `
            <h4>⚡ Ferramentas de Otimização</h4>
            
            <div class="optimization-grid">
                <div class="optimization-card">
                    <h5>📦 Otimização de Carga</h5>
                    <p>Volume atual: 52 m³ (87% da capacidade ideal)</p>
                    <div class="optimization-suggestions">
                        <p>💡 <strong>Sugestão:</strong> Adicionar 8 m³ para maximizar eficiência</p>
                        <p>📈 <strong>Economia potencial:</strong> R$ 1.200 por viagem</p>
                    </div>
                    <button class="btn btn-success" data-action="optimize-load">Otimizar Carga</button>
                </div>
                
                <div class="optimization-card">
                    <h5>⏰ Otimização de Tempo</h5>
                    <p>Horário atual: Saída flexível</p>
                    <div class="optimization-suggestions">
                        <p>💡 <strong>Melhor horário:</strong> Saída às 06:00 (evita trânsito)</p>
                        <p>📈 <strong>Economia tempo:</strong> 2-3 horas</p>
                    </div>
                    <button class="btn btn-success">Agendar Horário Ótimo</button>
                </div>
                
                <div class="optimization-card">
                    <h5>💰 Otimização de Custos</h5>
                    <p>Custo atual: R$ 8,33/km</p>
                    <div class="optimization-suggestions">
                        <p>💡 <strong>Oportunidade:</strong> Carga de retorno disponível</p>
                        <p>📈 <strong>Redução custo:</strong> Até R$ 2.500</p>
                    </div>
                    <button class="btn btn-success">Buscar Carga Retorno</button>
                </div>
                
                <div class="optimization-card">
                    <h5>📊 Análise Preditiva</h5>
                    <p>Base: Histórico de 24 meses</p>
                    <div class="optimization-suggestions">
                        <p>💡 <strong>Tendência:</strong> Preços 8% abaixo em Março</p>
                        <p>📈 <strong>Economia prevista:</strong> R$ 880</p>
                    </div>
                    <button class="btn btn-success">Ver Análise Completa</button>
                </div>
            </div>
            
            <div class="predictive-analysis">
                <h5>🔮 Análise Preditiva de Mercado</h5>
                <div class="market-forecast">
                    <div class="forecast-item">
                        <span class="month">Março 2025</span>
                        <span class="trend down">-8%</span>
                        <span class="price">R$ 10.120</span>
                    </div>
                    <div class="forecast-item">
                        <span class="month">Abril 2025</span>
                        <span class="trend down">-5%</span>
                        <span class="price">R$ 10.450</span>
                    </div>
                    <div class="forecast-item">
                        <span class="month">Maio 2025</span>
                        <span class="trend stable">±0%</span>
                        <span class="price">R$ 11.000</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderCostTracking() {
        return `
            <h4>📊 Acompanhamento de Custos</h4>
            
            <div class="cost-breakdown">
                <h5>💰 Decomposição de Custos</h5>
                <div class="cost-chart">
                    <div class="cost-item">
                        <span class="cost-label">Combustível</span>
                        <div class="cost-bar">
                            <div class="cost-fill" style="width: 24%;"></div>
                        </div>
                        <span class="cost-value">R$ 2.640 (24%)</span>
                    </div>
                    
                    <div class="cost-item">
                        <span class="cost-label">Motorista</span>
                        <div class="cost-bar">
                            <div class="cost-fill" style="width: 16.4%;"></div>
                        </div>
                        <span class="cost-value">R$ 1.800 (16,4%)</span>
                    </div>
                    
                    <div class="cost-item">
                        <span class="cost-label">Pedágios</span>
                        <div class="cost-bar">
                            <div class="cost-fill" style="width: 2.6%;"></div>
                        </div>
                        <span class="cost-value">R$ 285 (2,6%)</span>
                    </div>
                    
                    <div class="cost-item">
                        <span class="cost-label">Seguro</span>
                        <div class="cost-bar">
                            <div class="cost-fill" style="width: 2.5%;"></div>
                        </div>
                        <span class="cost-value">R$ 275 (2,5%)</span>
                    </div>
                    
                    <div class="cost-item">
                        <span class="cost-label">Outros</span>
                        <div class="cost-bar">
                            <div class="cost-fill" style="width: 54.5%;"></div>
                        </div>
                        <span class="cost-value">R$ 6.000 (54,5%)</span>
                    </div>
                </div>
            </div>
            
            <div class="tracking-metrics">
                <h5>📈 Métricas de Acompanhamento</h5>
                <div class="metrics-grid">
                    <div class="metric-item">
                        <span class="metric-label">Variação Combustível</span>
                        <span class="metric-value trend-up">+3,2%</span>
                        <small>vs. mês anterior</small>
                    </div>
                    
                    <div class="metric-item">
                        <span class="metric-label">Eficiência Rota</span>
                        <span class="metric-value trend-stable">98,5%</span>
                        <small>vs. planejado</small>
                    </div>
                    
                    <div class="metric-item">
                        <span class="metric-label">Custo vs. Mercado</span>
                        <span class="metric-value trend-down">-20,7%</span>
                        <small>abaixo da média</small>
                    </div>
                    
                    <div class="metric-item">
                        <span class="metric-label">Pontualidade</span>
                        <span class="metric-value trend-up">95%</span>
                        <small>entregas no prazo</small>
                    </div>
                </div>
            </div>
            
            <div class="alerts-section">
                <h5>🚨 Alertas e Recomendações</h5>
                <div class="alert alert-info">
                    <strong>📢 Oportunidade:</strong> Preço do combustível 5% abaixo da média regional. 
                    Momento favorável para agendar próximas operações.
                </div>
                <div class="alert alert-warning">
                    <strong>⚠️ Atenção:</strong> Previsão de chuvas na BR-116 para próxima semana. 
                    Considere ajustar cronograma.
                </div>
            </div>
        `;
    }

    setupTabSwitching() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active from all tabs
                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanes.forEach(p => p.classList.remove('active'));

                // Add active to clicked tab
                btn.classList.add('active');
                const targetTab = btn.getAttribute('data-tab') + '-tab';
                document.getElementById(targetTab).classList.add('active');
            });
        });
    }

    getCurrentSeasonDescription() {
        const currentMonth = new Date().getMonth();
        const monthNames = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        
        const currentMonthName = monthNames[currentMonth];
        
        if (this.marketData.seasonalVariations.high.includes(currentMonthName)) {
            return 'Alta temporada (+15% nos preços)';
        } else if (this.marketData.seasonalVariations.medium.includes(currentMonthName)) {
            return 'Média temporada (+5% nos preços)';
        }
        return 'Baixa temporada (preços base)';
    }

    selectTransporter(name) {
        const transporter = this.transporters.find(t => t.name === name);
        if (transporter) {
            const confirmation = confirm(
                `Confirma seleção da ${transporter.name}?\n\n` +
                `Preço: R$ ${transporter.seasonalPrice.toLocaleString('pt-BR')}\n` +
                `Tempo estimado: ${transporter.estimatedTime}h\n` +
                `Avaliação: ${transporter.rating}/5\n\n` +
                `Vantagens: ${transporter.advantages.join(', ')}`
            );
            
            if (confirmation) {
                this.processTransporterSelection(transporter);
            }
        }
    }

    processTransporterSelection(transporter) {
        // Simulate transporter selection process
        const result = {
            selectedTransporter: transporter.name,
            finalPrice: transporter.seasonalPrice,
            estimatedDelivery: this.calculateDeliveryDate(transporter.estimatedTime),
            trackingNumber: this.generateTrackingNumber(),
            contractTerms: this.generateContractTerms(transporter)
        };

        this.showSelectionResult(result);
    }

    calculateDeliveryDate(hoursToDeliver) {
        const now = new Date();
        const deliveryDate = new Date(now.getTime() + (hoursToDeliver * 60 * 60 * 1000));
        return deliveryDate.toLocaleString('pt-BR');
    }

    generateTrackingNumber() {
        return 'ML' + Date.now().toString().slice(-8);
    }

    generateContractTerms(transporter) {
        return {
            insurance: transporter.insurance ? 'Seguro total incluso' : 'Seguro básico',
            tracking: transporter.tracking ? 'Rastreamento GPS em tempo real' : 'Acompanhamento por telefone',
            warranty: '30 dias para reclamações',
            payment: 'Pagamento em 15 dias após entrega'
        };
    }

    showSelectionResult(result) {
        const modal = document.createElement('div');
        modal.className = 'selection-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <h3>✅ Transportadora Selecionada</h3>
                    <div class="selection-details">
                        <p><strong>Transportadora:</strong> ${result.selectedTransporter}</p>
                        <p><strong>Preço Final:</strong> R$ ${result.finalPrice.toLocaleString('pt-BR')}</p>
                        <p><strong>Entrega Prevista:</strong> ${result.estimatedDelivery}</p>
                        <p><strong>Nº Rastreamento:</strong> ${result.trackingNumber}</p>
                        
                        <h4>Termos do Contrato:</h4>
                        <ul>
                            <li>${result.contractTerms.insurance}</li>
                            <li>${result.contractTerms.tracking}</li>
                            <li>${result.contractTerms.warranty}</li>
                            <li>${result.contractTerms.payment}</li>
                        </ul>
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn-success" onclick="this.closest('.selection-modal').remove()">
                            Confirmar Contratação
                        </button>
                        <button class="btn btn-secondary" onclick="this.closest('.selection-modal').remove()">
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add styles
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            z-index: 1000; background: rgba(0,0,0,0.5); display: flex; 
            align-items: center; justify-content: center;
        `;

        document.body.appendChild(modal);
    }

    showRouteSimulation() {
        alert('🔍 Iniciando simulação de rotas...\n\nEsta funcionalidade integrará com sistemas de GPS e análise de tráfego em tempo real para otimizar a seleção da melhor rota.');
    }

    requestQuotes() {
        alert('📞 Solicitando cotações...\n\nEmails automáticos serão enviados para todas as transportadoras qualificadas. Você receberá as respostas em até 2 horas.');
    }
}

// Add CSS for logistics components
const logisticsCSS = `
<style>
.logistics-tabs {
    display: flex;
    gap: 0.5rem;
    margin: 1rem 0;
    border-bottom: 2px solid #eee;
}

.tab-btn {
    padding: 0.75rem 1rem;
    border: none;
    background: #f8f9fa;
    cursor: pointer;
    border-radius: 5px 5px 0 0;
    transition: all 0.3s;
}

.tab-btn.active {
    background: #3498db;
    color: white;
}

.tab-pane {
    display: none;
    padding: 1.5rem 0;
}

.tab-pane.active {
    display: block;
}

.transporters-table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
}

.transporters-table th,
.transporters-table td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #eee;
}

.transporters-table th {
    background: #f8f9fa;
    font-weight: bold;
}

.rating {
    color: #f39c12;
}

.route-card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    margin-bottom: 1rem;
}

.route-card.current {
    border-left: 4px solid #27ae60;
}

.route-card.alternative {
    border-left: 4px solid #3498db;
}

.difference.positive {
    color: #27ae60;
}

.difference.negative {
    color: #e74c3c;
}

.badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    border-radius: 3px;
    font-size: 0.8rem;
    margin: 0.2rem;
}

.badge.success {
    background: #d4edda;
    color: #155724;
}

.badge.info {
    background: #cce7ff;
    color: #004085;
}

.badge.warning {
    background: #fff3cd;
    color: #856404;
}

.optimization-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
    margin: 1rem 0;
}

.optimization-card {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 8px;
    border-left: 4px solid #3498db;
}

.cost-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
}

.cost-label {
    min-width: 100px;
    font-size: 0.9rem;
}

.cost-bar {
    flex: 1;
    height: 20px;
    background: #eee;
    border-radius: 10px;
    overflow: hidden;
}

.cost-fill {
    height: 100%;
    background: #3498db;
    transition: width 0.3s;
}

.cost-value {
    min-width: 120px;
    text-align: right;
    font-size: 0.9rem;
}
</style>
`;

// Inject CSS
document.head.insertAdjacentHTML('beforeend', logisticsCSS);

// Initialize logistics manager
document.addEventListener('DOMContentLoaded', () => {
    window.logisticsManager = new LogisticsManager();
    logisticsManager.init();
});