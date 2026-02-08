        /** * MÓDULO: CONTROLADORES GLOBALES
         * Estas funciones conectan la UI con las acciones
         */
        window.handleAction = (type) => Actions.handleGlobalAction(type);
        window.closeModal = () => document.getElementById('globalModal').classList.add('hidden');
        
        window.submitTransaction = (type) => {
            const qty = parseFloat(document.getElementById('m_qty').value);
            const item = State.getItem(State.selectedId);
            
            if (type === 'salida' && qty > item.quantity) {
                alert('No hay stock suficiente');
                return;
            }
            
            State.updateStock(State.selectedId, qty, type);
            closeModal();
            UI.renderTable();
        };

        window.submitEdit = () => {
            const item = State.getItem(State.selectedId);
            item.code = document.getElementById('m_code').value.toUpperCase();
            item.description = document.getElementById('m_desc').value;
            item.unit = document.getElementById('m_unit').value;
            item.reorderPoint = parseFloat(document.getElementById('m_reorder').value);
            State.save();
            closeModal();
            UI.updateSidebarInfo(item);
            UI.renderTable();
        };

        window.submitNew = () => {
            const newItem = {
                id: 'ID-' + Date.now(),
                code: document.getElementById('m_code').value.toUpperCase(),
                description: document.getElementById('m_desc').value,
                quantity: parseFloat(document.getElementById('m_qty').value),
                unit: document.getElementById('m_unit').value,
                reorderPoint: parseFloat(document.getElementById('m_reorder').value)
            };
            State.inventory.push(newItem);
            State.save();
            closeModal();
            UI.renderTable();
        };

        // Iniciar
        document.getElementById('closeSidebar').onclick = () => UI.toggleSidebar(false);
        document.getElementById('addNewBtn').onclick = () => Actions.addNew();
        document.getElementById('exportBtn').onclick = () => {
            const data = `const initialDepartmentInventory = ${JSON.stringify(State.inventory, null, 2)};`;
            const blob = new Blob([data], {type: 'text/javascript'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'inventario_data.js';
            a.click();
        };

        UI.renderTable();
