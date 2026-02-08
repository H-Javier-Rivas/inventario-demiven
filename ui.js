        /** * MÓDULO: UI / RENDERIZADO
         * En una app profesional esto iría en 'ui.js'
         */
        const UI = {
            renderTable() {
                const container = document.getElementById('inventoryBody');
                container.innerHTML = '';
                
                if (State.inventory.length === 0) {
                    document.getElementById('emptyState').classList.remove('hidden');
                    return;
                }
                document.getElementById('emptyState').classList.add('hidden');

                State.inventory.sort((a,b) => a.code.localeCompare(b.code)).forEach(item => {
                    const row = document.createElement('tr');
                    row.className = `cursor-pointer hover:bg-slate-50 transition-all ${State.selectedId === item.id ? 'selected-row' : ''}`;
                    row.onclick = () => Actions.selectItem(item.id);
                    
                    const isLow = item.reorderPoint && item.quantity <= item.reorderPoint;
                    
                    row.innerHTML = `
                        <td class="px-6 py-4 font-mono text-xs font-bold text-slate-600">${item.code}</td>
                        <td class="px-6 py-4">
                            <div class="text-sm font-semibold">${item.description}</div>
                            ${isLow ? '<span class="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">REORDEN</span>' : ''}
                        </td>
                        <td class="px-6 py-4 text-right font-mono text-sm ${isLow ? 'text-red-600 font-bold' : 'text-slate-700'}">
                            ${parseFloat(item.quantity).toLocaleString('es-VE')}
                        </td>
                        <td class="px-6 py-4 text-xs text-slate-400 font-medium">${item.unit}</td>
                    `;
                    container.appendChild(row);
                });
                lucide.createIcons();
            },

            toggleSidebar(show) {
                const sidebar = document.getElementById('actionSidebar');
                if (show) {
                    sidebar.classList.remove('hidden');
                } else {
                    sidebar.classList.add('hidden');
                    State.selectedId = null;
                    this.renderTable();
                }
            },

            updateSidebarInfo(item) {
                document.getElementById('sideCode').innerText = item.code;
                document.getElementById('sideDesc').innerText = item.description;
            }
        };
