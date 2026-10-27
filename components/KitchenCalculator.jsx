"use client";


import React, { useState, useEffect } from 'react';
import { ChefHat, Calculator, Scale, CheckCircle2, Circle, Utensils, RefreshCcw } from 'lucide-react';

// --- BASE DE DATOS DE RECETAS (MOCK DATA) ---
const RECIPES = [
  {
    id: 'vegan-pie',
    name: 'Vegan Chocolate Tofu Pie with Yucca Crust',
    description: 'Postre sin lácteos. Base crujiente de yuca y relleno cremoso de tofu silken y chocolate oscuro.',
    ingredients: [
      { name: 'Masa de yuca procesada', baseAmount: 500, unit: 'g' },
      { name: 'Tofu Silken (firmeza media)', baseAmount: 350, unit: 'g' },
      { name: 'Chocolate oscuro (70% cacao)', baseAmount: 200, unit: 'g' },
      { name: 'Sirope de Maple', baseAmount: 100, unit: 'ml' },
      { name: 'Aceite de coco derretido', baseAmount: 50, unit: 'g' },
      { name: 'Extracto de vainilla', baseAmount: 10, unit: 'ml' },
      { name: 'Pizca de sal marina', baseAmount: 2, unit: 'g' }
    ]
  },
  {
    id: 'pad-thai',
    name: 'Pad Thai',
    description: 'Clásico de fideos de arroz salteados, salsa agridulce de tamarindo y maní tostado.',
    ingredients: [
      { name: 'Fideos de arroz (secos)', baseAmount: 200, unit: 'g' },
      { name: 'Proteína (Tofu firme o Pollo)', baseAmount: 150, unit: 'g' },
      { name: 'Pasta de Tamarindo', baseAmount: 45, unit: 'ml' },
      { name: 'Salsa de soya (o de pescado)', baseAmount: 30, unit: 'ml' },
      { name: 'Azúcar de palma', baseAmount: 20, unit: 'g' },
      { name: 'Brotes de soya', baseAmount: 100, unit: 'g' },
      { name: 'Maní tostado triturado', baseAmount: 30, unit: 'g' },
      { name: 'Cebollín fresco', baseAmount: 15, unit: 'g' }
    ]
  },
  {
    id: 'house-bread',
    name: 'House Bread (Pan de la Casa)',
    description: 'Masa madre / Pan rústico de fermentación lenta.',
    ingredients: [
      { name: 'Harina de fuerza', baseAmount: 1000, unit: 'g' },
      { name: 'Agua filtrada', baseAmount: 700, unit: 'ml' },
      { name: 'Sal fina', baseAmount: 20, unit: 'g' },
      { name: 'Masa madre activa (o Levadura)', baseAmount: 200, unit: 'g' }
    ]
  }
];

export default function KitchenRecipeCalculator() {
  // Estado para manejar la receta seleccionada, el multiplicador y la lista de verificación
  const [selectedRecipeId, setSelectedRecipeId] = useState(RECIPES[0].id);
  const [multiplier, setMultiplier] = useState(1);
  const [checkedItems, setCheckedItems] = useState({});

  const activeRecipe = RECIPES.find(r => r.id === selectedRecipeId) || RECIPES[0];

  // Reiniciar la lista de verificación cuando cambia la receta
  useEffect(() => {
    setCheckedItems({});
  }, [selectedRecipeId]);

  // Manejar el toggle (marcar/desmarcar) de ingredientes
  const toggleCheck = (index) => {
    setCheckedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Formatear cantidades para evitar muchos decimales innecesarios (ej: 1.50 -> 1.5)
  const formatAmount = (amount) => {
    const scaled = amount * multiplier;
    // Redondear a máximo 2 decimales y quitar ceros innecesarios
    return parseFloat(scaled.toFixed(2));
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans selection:bg-orange-200">
      
      {/* HEADER TOP BAR */}
      <header className="bg-slate-900 text-white p-4 shadow-md flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <ChefHat size={32} className="text-orange-400" />
          <h1 className="text-2xl font-bold tracking-tight">Kitchen Prep Calculator</h1>
        </div>
        <div className="text-slate-400 text-sm hidden sm:block">
          Precisión y Estandarización
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* LEFT COLUMN: CONTROLS */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          
          {/* SELECCIÓN DE RECETA */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-700">
              <Utensils size={20} />
              1. Seleccionar Receta
            </h2>
            <div className="relative">
              <select 
                className="w-full appearance-none bg-slate-50 border-2 border-slate-200 text-slate-800 text-lg rounded-xl px-4 py-4 pr-10 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all font-medium cursor-pointer"
                value={selectedRecipeId}
                onChange={(e) => setSelectedRecipeId(e.target.value)}
              >
                {RECIPES.map(recipe => (
                  <option key={recipe.id} value={recipe.id}>
                    {recipe.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
              {activeRecipe.description}
            </p>
          </div>

          {/* ESCALADOR / MULTIPLICADOR */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-700">
              <Calculator size={20} />
              2. Ajustar Cantidad
            </h2>
            
            {/* Valor Actual Display */}
            <div className="flex items-center justify-center mb-6">
              <div className="text-6xl font-black text-orange-600 tracking-tighter">
                {multiplier}x
              </div>
            </div>

            {/* Slider de precisión */}
            <div className="mb-8 px-2">
              <label className="text-sm font-medium text-slate-500 mb-2 block">Ajuste fino:</label>
              <input 
                type="range" 
                min="0.1" 
                max="5" 
                step="0.1" 
                value={multiplier}
                onChange={(e) => setMultiplier(parseFloat(e.target.value))}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-500/30"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                <span>0.1x</span>
                <span>5.0x</span>
              </div>
            </div>

            {/* Botones rápidos (Mejor para uso táctil en cocina) */}
            <div>
              <label className="text-sm font-medium text-slate-500 mb-3 block">Acciones Rápidas:</label>
              <div className="grid grid-cols-5 gap-2">
                {[0.5, 1, 1.5, 2, 3].map((val) => (
                  <button
                    key={val}
                    onClick={() => setMultiplier(val)}
                    className={`py-3 rounded-xl text-lg font-bold transition-all border-b-4 active:border-b-0 active:translate-y-1 ${
                      multiplier === val 
                        ? 'bg-orange-500 text-white border-orange-700 shadow-md' 
                        : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {val}x
                  </button>
                ))}
              </div>
            </div>
            
          </div>
        </section>

        {/* RIGHT COLUMN: RESULT RECIPE */}
        <section className="lg:col-span-7">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
            
            {/* Cabecera de la receta */}
            <div className="bg-slate-50 border-b border-slate-200 p-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-1">{activeRecipe.name}</h2>
                <div className="flex items-center gap-2 text-orange-600 font-semibold bg-orange-100 px-3 py-1 rounded-full inline-flex">
                  <Scale size={16} />
                  <span>Escalado a {multiplier}x</span>
                </div>
              </div>
              <button 
                onClick={() => setCheckedItems({})}
                className="p-3 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors flex flex-col items-center gap-1"
                title="Reiniciar Checklist"
              >
                <RefreshCcw size={20} />
                <span className="text-xs font-medium">Reset</span>
              </button>
            </div>

            {/* Lista de ingredientes */}
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">
                Ingredientes a pesar
              </div>
              
              <ul className="space-y-3">
                {activeRecipe.ingredients.map((ing, index) => {
                  const isChecked = checkedItems[index];
                  const calculatedAmount = formatAmount(ing.baseAmount);
                  
                  return (
                    <li 
                      key={index}
                      onClick={() => toggleCheck(index)}
                      className={`
                        flex items-center justify-between p-4 rounded-xl cursor-pointer border-2 transition-all select-none
                        ${isChecked 
                          ? 'bg-green-50 border-green-200 opacity-60' 
                          : 'bg-white border-slate-100 hover:border-orange-300 shadow-sm'}
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`${isChecked ? 'text-green-500' : 'text-slate-300'}`}>
                          {isChecked ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                        </div>
                        <span className={`text-lg font-medium transition-all ${isChecked ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                          {ing.name}
                        </span>
                      </div>
                      
                      <div className="flex items-baseline gap-1 text-right min-w-[120px] justify-end">
                        <span className={`text-2xl font-bold tabular-nums ${isChecked ? 'text-slate-500' : 'text-orange-600'}`}>
                          {calculatedAmount}
                        </span>
                        <span className={`text-sm font-semibold ${isChecked ? 'text-slate-400' : 'text-slate-500'}`}>
                          {ing.unit}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
              
              <div className="mt-8 p-4 bg-blue-50 text-blue-800 rounded-xl border border-blue-200 text-sm flex gap-3">
                <div className="mt-0.5">ℹ️</div>
                <p>
                  <strong>Tip de cocina:</strong> Toca cada ingrediente en la lista conforme lo vayas pesando para mantener el orden en tu estación de trabajo (Mise en place).
                </p>
              </div>
              
            </div>
          </div>
        </section>
        
      </main>
    </div>
  );
}
