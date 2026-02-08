        /** * MÓDULO: ACCIONES / LÓGICA DE NEGOCIO
         * En una app profesional esto iría en 'actions.js'
         */
        const Actions = {
            selectItem(id) {
                State.selectedId = id;
                const item = State.getItem(id);
                UI.updateSidebarInfo(item);
                UI.toggleSidebar(true);
                UI.renderTable();
            },

            handleGlobalAction(type) {
                const item = State.getItem(State.selectedId);
                const modal = document.getElementById('globalModal');
                const content = document.getElementById('modalContent');
                
                let html = '';
                
                switch(type) {
                    case 'entrada':
                    case 'salida':
                        html = `
                            <h2 class="text-xl font-bold mb-2">${type === 'entrada' ? 'Entrada' : 'Salida'} de Material</h2>
                            <p class="text-sm text-slate-500 mb-6">${item.description}</p>
                            <form onsubmit="event.preventDefault(); submitTransaction('${type}')" class="space-y-4">
                                <div>
                                    <label class="block text-xs font-bold text-slate-400 uppercase mb-1">Cantidad (${item.unit})</label>
                                    <input type="number" id="m_qty" step="any" required class="w-full border-slate-200 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-slate-400 uppercase mb-1">Autorizado por</label>
                                    <input type="text" id="m_auth" required class="w-full border-slate-200 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none">
                                </div>
                                <div class="flex gap-2 pt-4">
                                    <button type="button" onclick="closeModal()" class="flex-1 py-3 text-slate-500 font-bold">Cancelar</button>
                                    <button type="submit" class="flex-1 py-3 bg-blue-800 text-white rounded-xl font-bold">Confirmar</button>
                                </div>
                            </form>
                        `;
                        break;
                    
                    case 'edit':
                        html = `
                            <h2 class="text-xl font-bold mb-6">Editar Producto</h2>
                            <form onsubmit="event.preventDefault(); submitEdit()" class="space-y-4">
                                <input type="hidden" id="m_id" value="${item.id}">
                                <div>
                                    <label class="block text-xs font-bold text-slate-400 uppercase mb-1">Código</label>
                                    <input type="text" id="m_code" value="${item.code}" required class="w-full border-slate-200 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none uppercase">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-slate-400 uppercase mb-1">Descripción</label>
                                    <textarea id="m_desc" required class="w-full border-slate-200 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none">${item.description}</textarea>
                                </div>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-xs font-bold text-slate-400 uppercase mb-1">Unidad</label>
                                        <input type="text" id="m_unit" value="${item.unit}" required class="w-full border-slate-200 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none">
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold text-slate-400 uppercase mb-1">Reorden</label>
                                        <input type="number" id="m_reorder" value="${item.reorderPoint}" class="w-full border-slate-200 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none">
                                    </div>
                                </div>
                                <div class="flex gap-2 pt-4">
                                    <button type="button" onclick="closeModal()" class="flex-1 py-3 text-slate-500 font-bold">Cerrar</button>
                                    <button type="submit" class="flex-1 py-3 bg-blue-800 text-white rounded-xl font-bold">Guardar Cambios</button>
                                </div>
                            </form>
                        `;
                        break;

                    case 'delete':
                        if (confirm(`¿Estás seguro de eliminar permanentemente ${item.code}?`)) {
                            State.inventory = State.inventory.filter(i => i.id !== item.id);
                            State.save();
                            UI.toggleSidebar(false);
                            UI.renderTable();
                        }
                        return;
                }
                
                if (html) {
                    content.innerHTML = html;
                    modal.classList.remove('hidden');
                }
            },

            addNew() {
                const modal = document.getElementById('globalModal');
                const content = document.getElementById('modalContent');
                content.innerHTML = `
                    <h2 class="text-xl font-bold mb-6">Nuevo Producto</h2>
                    <form onsubmit="event.preventDefault(); submitNew()" class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-bold text-slate-400 uppercase mb-1">Código</label>
                                <input type="text" id="m_code" required class="w-full border-slate-200 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none uppercase">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-400 uppercase mb-1">Existencia Inicial</label>
                                <input type="number" id="m_qty" value="0" step="any" required class="w-full border-slate-200 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none">
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-400 uppercase mb-1">Descripción</label>
                            <textarea id="m_desc" required class="w-full border-slate-200 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-bold text-slate-400 uppercase mb-1">Unidad</label>
                                <input type="text" id="m_unit" placeholder="Pza, Kg..." required class="w-full border-slate-200 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-400 uppercase mb-1">Punto Reorden</label>
                                <input type="number" id="m_reorder" value="0" class="w-full border-slate-200 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none">
                            </div>
                        </div>
                        <div class="flex gap-2 pt-4">
                            <button type="button" onclick="closeModal()" class="flex-1 py-3 text-slate-500 font-bold">Cancelar</button>
                            <button type="submit" class="flex-1 py-3 bg-blue-800 text-white rounded-xl font-bold">Crear Producto</button>
                        </div>
                    </form>
                `;
                modal.classList.remove('hidden');
            }
        };
