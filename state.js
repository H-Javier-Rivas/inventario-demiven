/** * MÓDULO: ESTADO (STATE MANAGEMENT)
* En una app profesional esto iría en 'state.js'
*/
const State = {
  inventory: JSON.parse(localStorage.getItem('demivenInventory')) || initialDepartmentInventory || [],
  selectedId: null,

  save() {
    localStorage.setItem('demivenInventory', JSON.stringify(this.inventory));
  },

  getItem(id) {
    return this.inventory.find(i => i.id === id);
  },

  updateStock(id, qty, type) {
    const item = this.getItem(id);
    if (type === 'entrada') item.quantity += qty;
    if (type === 'salida') item.quantity -= qty;
    this.save();
  }
};
