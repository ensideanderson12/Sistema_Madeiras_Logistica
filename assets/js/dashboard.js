// Dashboard specific functionality
class DashboardManager {
    constructor() {
        this.metrics = {
            totalRevenue: 0,
            totalCosts: 0,
            profitMargin: 0,
            efficiency: 0
        };
        this.updateInterval = null;
    }

    init() {
        this.startRealTimeUpdates();
        this.setupDashboardInteractions();
    }

    startRealTimeUpdates() {
        // Update metrics every 30 seconds (simulated real-time)
        this.updateInterval = setInterval(() => {
            this.updateMetrics();
        }, 30000);
    }

    updateMetrics() {
        // Simulate real-time data updates
        const variations = {
            freight: Math.random() * 200 - 100, // ±100 variation
            efficiency: Math.random() * 5 - 2.5, // ±2.5% variation
        };

        // Update freight cost with variation
        const currentFreight = 11000 + variations.freight;
        const freightPerM3 = currentFreight / 52;
        
        this.updateElement('total-logistics', this.formatCurrency(currentFreight));
        
        // Update efficiency indicator
        const efficiencyElement = document.querySelector('.metric-card:nth-child(4) .metric-value');
        if (efficiencyElement) {
            efficiencyElement.textContent = `R$ ${freightPerM3.toFixed(2)}`;
        }

        // Add visual indicator for changes
        this.addChangeIndicator(currentFreight > 11000 ? 'up' : 'down');
    }

    addChangeIndicator(direction) {
        const indicators = document.querySelectorAll('.change-indicator');
        indicators.forEach(indicator => indicator.remove());

        const freightCard = document.querySelector('.metric-card:nth-child(2)');
        if (freightCard) {
            const indicator = document.createElement('span');
            indicator.className = `change-indicator ${direction}`;
            indicator.innerHTML = direction === 'up' ? '↗️' : '↘️';
            freightCard.appendChild(indicator);

            // Remove indicator after 3 seconds
            setTimeout(() => indicator.remove(), 3000);
        }
    }

    setupDashboardInteractions() {
        // Add click handlers for metric cards
        const metricCards = document.querySelectorAll('.metric-card');
        metricCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                this.showMetricDetails(index);
            });
            
            // Add hover effects
            card.style.cursor = 'pointer';
        });

        // Setup product cards interaction
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.addEventListener('click', () => {
                this.toggleProductDetails(card);
            });
        });
    }

    showMetricDetails(metricIndex) {
        const details = [
            {
                title: 'Análise de Distância',
                content: 'Rota otimizada: Mandirituba/PR → Rio Pomba/MG via BR-376 e BR-116. Consideradas rotas alternativas com variação de ±50km.'
            },
            {
                title: 'Detalhamento do Frete',
                content: 'Valor inclui: transporte, seguro, pedágio e combustível. Preço competitivo 20% abaixo da média nacional.'
            },
            {
                title: 'Composição do Volume',
                content: '28m³ Pinus Convencional (53,8%) + 24m³ Pinus Seco (46,2%). Otimização de carga para aproveitamento máximo.'
            },
            {
                title: 'Análise de Custo por m³',
                content: 'Custo logístico representa 19,8% do valor total da operação. Benchmark: 15-25% para operações similares.'
            }
        ];

        const detail = details[metricIndex];
        if (detail) {
            this.showModal(detail.title, detail.content);
        }
    }

    toggleProductDetails(card) {
        const existingDetails = card.querySelector('.extended-details');
        
        if (existingDetails) {
            existingDetails.remove();
            return;
        }

        const productType = card.querySelector('h4').textContent.includes('Convencional') ? 'convencional' : 'seco';
        const details = this.getProductExtendedDetails(productType);
        
        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'extended-details';
        detailsDiv.innerHTML = details;
        
        card.appendChild(detailsDiv);
    }

    getProductExtendedDetails(type) {
        const details = {
            convencional: `
                <hr style="margin: 1rem 0;">
                <h5>📋 Detalhes Técnicos</h5>
                <p><strong>Umidade:</strong> 15-20%</p>
                <p><strong>Densidade:</strong> 500 kg/m³</p>
                <p><strong>Tratamento:</strong> Natural</p>
                <p><strong>Aplicação:</strong> Construção civil, móveis</p>
                <p><strong>Origem:</strong> Florestas plantadas - Paraná</p>
            `,
            seco: `
                <hr style="margin: 1rem 0;">
                <h5>📋 Detalhes Técnicos</h5>
                <p><strong>Umidade:</strong> 8-12%</p>
                <p><strong>Densidade:</strong> 450 kg/m³</p>
                <p><strong>Tratamento:</strong> Secagem em estufa</p>
                <p><strong>Aplicação:</strong> Móveis finos, acabamentos</p>
                <p><strong>Origem:</strong> Florestas certificadas - Paraná</p>
            `
        };
        
        return details[type] || '';
    }

    showModal(title, content) {
        // Remove existing modal if present
        const existingModal = document.querySelector('.modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${title}</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p>${content}</p>
                    </div>
                </div>
            </div>
        `;

        // Add modal styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1000;
        `;

        const overlay = modal.querySelector('.modal-overlay');
        overlay.style.cssText = `
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const content_el = modal.querySelector('.modal-content');
        content_el.style.cssText = `
            background: white;
            border-radius: 10px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        `;

        const header = modal.querySelector('.modal-header');
        header.style.cssText = `
            padding: 1rem 1.5rem;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

        const body = modal.querySelector('.modal-body');
        body.style.cssText = `
            padding: 1.5rem;
        `;

        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #999;
        `;

        // Add event listeners
        closeBtn.addEventListener('click', () => modal.remove());
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                modal.remove();
            }
        });

        document.body.appendChild(modal);
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

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// Initialize dashboard manager
document.addEventListener('DOMContentLoaded', () => {
    const dashboardManager = new DashboardManager();
    dashboardManager.init();
    
    // Store globally for cleanup
    window.dashboardManager = dashboardManager;
});