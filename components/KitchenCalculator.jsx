"use client";

import React, { useState, useEffect } from 'react';
import { Minus, Plus, CheckCircle2, Circle, ChefHat, X, Trash2, ShoppingCart } from 'lucide-react';

const recipes = [
  {
    id: '1',
    name: 'Masa de Yuca (Crust para Pie)',
    category: 'Panadería Vegana',
    tip: 'Asegúrate de que el agua esté bien fría para evitar que el aceite de coco se derrita antes de hornear.',
    ingredients: [
      { name: 'Harina de yuca', baseQuantity: 500, unit: 'g' },
      { name: 'Aceite de coco', baseQuantity: 150, unit: 'g' },
      { name: 'Agua fría', baseQuantity: 100, unit: 'ml' },
      { name: 'Sal', baseQuantity: 5, unit: 'g' }
    ],
    steps: [
      'Pesar y mezclar la harina de yuca con la sal en un bowl grande.',
      'Incorporar el aceite de coco frotando con los dedos hasta obtener una textura arenosa.',
      'Agregar el agua fría poco a poco mientras amasas suavemente.',
      'Formar una bola, envolver y refrigerar por 15 minutos antes de estirar.'
    ]
  },
  {
    id: '2',
    name: 'Base de Caldo Fat Noodle',
    category: 'Salsas y Caldos',
    tip: 'No dejes que el caldo hierva a borbotones fuertes para que no se enturbie.',
    ingredients: [
      { name: 'Agua filtrada', baseQuantity: 4, unit: 'L' },
      { name: 'Salsa de soya', baseQuantity: 500, unit: 'ml' },
      { name: 'Jengibre fresco', baseQuantity: 100, unit: 'g' },
      { name: 'Ajo pelado', baseQuantity: 50, unit: 'g' }
    ],
    steps: [
      'Lavar y machacar ligeramente el jengibre y el ajo (sin picar).',
      'Colocar el agua filtrada en la olla grande a fuego medio.',
      'Añadir la salsa de soya, el jengibre y el ajo.',
      'Llevar a un hervor suave, bajar el fuego al mínimo y cocinar por 45 minutos.',
      'Colar y almacenar correctamente etiquetado.'
    ]
  }
];

export default function KitchenCalculator() {
  // Estados de la Calculadora Principal
  const [selectedRecipeId, setSelectedRecipeId] = useState(recipes[0].id);
  const [multiplier, setMultiplier] = useState(1);
  const [toggledIngredients, setToggledIngredients] = useState({});
  const [toggledSteps, setToggledSteps] = useState({});

  // Estados del Menú de Producción Semanal
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [weeklyProduction, setWeeklyProduction] = useState([]); // Lista de recetas agregadas
  const [isAddingToWeekly, setIsAddingToWeekly] = useState(false);
  const [weeklyRecipeSelect, setWeeklyRecipeSelect] = useState(recipes[0].id);
  const [weeklyMultiplierSelect, setWeeklyMultiplierSelect] = useState(1);
  const [purchasedIngredients, setPurchasedIngredients] = useState({});

  const selectedRecipe = recipes.find(r => r.id === selectedRecipeId);
  const quickMultipliers = [0.5, 1, 1.5, 2, 3];

  useEffect(() => {
    setToggledIngredients({});
    setToggledSteps({});
  }, [selectedRecipeId]);

  const toggleIngredient = (index) => setToggledIngredients(prev => ({ ...prev, [index]: !prev[index] }));
  const toggleStep = (index) => setToggledSteps(prev => ({ ...prev, [index]: !prev[index] }));
  
  // Funciones de Producción Semanal
  const handleAddWeeklyRecipe = () => {
    const newEntry = {
      id: Date.now().toString(), // ID único para poder borrar si hay recetas duplicadas
      recipeId: weeklyRecipeSelect,
      multiplier: weeklyMultiplierSelect
    };
    setWeeklyProduction([...weeklyProduction, newEntry]);
    setIsAddingToWeekly(false);
    setWeeklyMultiplierSelect(1); // Resetear para la próxima
  };

  const removeWeeklyRecipe = (idToRemove) => {
    setWeeklyProduction(weeklyProduction.filter(item => item.id !== idToRemove));
  };

  const togglePurchased = (ingredientName) => {
    setPurchasedIngredients(prev => ({ ...prev, [ingredientName]: !prev[ingredientName] }));
  };

  // Consolidar Ingredientes Totales
  const getAggregatedIngredients = () => {
    const totals = {};
    weeklyProduction.forEach(item => {
      const recipe = recipes.find(r => r.id === item.recipeId);
      if (recipe) {
        recipe.ingredients.forEach(ing => {
          if (!totals[ing.name]) {
            totals[ing.name] = { unit: ing.unit, amount: 0 };
          }
          totals[ing.name].amount += (ing.baseQuantity * item.multiplier);
        });
      }
    });
    // Convertir el objeto a un arreglo para poder mostrarlo
    return Object.keys(totals).map(name => ({
      name,
      amount: totals[name].amount,
      unit: totals[name].unit
    })).sort((a, b) => a.name.localeCompare(b.name));
  };

  const aggregatedList = getAggregatedIngredients();

  return (
    <div className="relative min-h-screen bg-gray-50">
      
      {/* MENÚ LATERAL (SIDEBAR) */}
      {/* Fondo oscuro (Overlay) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 transition-opacity" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* Panel Deslizable */}
      <div className={`fixed top-0 left-0 h-full w-full md:w-[450px] bg-gray-50 z-50 shadow-2xl transform transition-transform duration-300 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Header del Sidebar */}
        <div className="flex items-center justify-between p-4 bg-white border-b">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <ShoppingCart className="text-orange-500" />
            Producción Semanal
          </h2>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Contenido del Sidebar (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4">
          
          {/* VISTA: AGREGAR RECETA */}
          {isAddingToWeekly ? (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
              <h3 className="font-bold text-gray-800 mb-4">Buscar y Añadir Receta</h3>
              
              <label className="block text-sm font-semibold text-gray-600 mb-1">Seleccionar Receta</label>
              <select 
                className="w-full p-3 mb-4 text-base border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none bg-white"
                value={weeklyRecipeSelect}
                onChange={(e) => setWeeklyRecipeSelect(e.target.value)}
              >
                {recipes.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>

              <label className="block text-sm font-semibold text-gray-600 mb-1">Cantidad (Multiplicador)</label>
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {quickMultipliers.map(mult => (
                  <button
                    key={mult}
                    onClick={() => setWeeklyMultiplierSelect(mult)}
                    className={`flex-1 py-2 px-3 rounded-lg font-bold transition-colors ${
                      weeklyMultiplierSelect === mult 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-white text-orange-600 border border-orange-200'
                    }`}
                  >
                    {mult}x
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={handleAddWeeklyRecipe}
                  className="flex-1 bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600"
                >
                  Añadir a la lista
                </button>
                <button 
                  onClick={() => setIsAddingToWeekly(false)}
                  className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-200"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            /* VISTA: LISTA DE PRODUCCIÓN Y TOTALES */
            <>
              {/* Lista de Recetas Programadas */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-800">Recetas a Preparar</h3>
                  <button 
                    onClick={() => setIsAddingToWeekly(true)}
                    className="flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full font-bold text-sm hover:bg-orange-200"
                  >
                    <Plus className="w-4 h-4" /> Agregar
                  </button>
                </div>

                {weeklyProduction.length === 0 ? (
                  <div className="text-center p-6 bg-white rounded-xl border border-dashed border-gray-300 text-gray-500">
                    No hay recetas programadas para esta semana. Toca "Agregar" para empezar.
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {weeklyProduction.map((item) => {
                      const rec = recipes.find(r => r.id === item.recipeId);
                      return (
                        <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                          <div>
                            <p className="font-bold text-gray-800 text-sm md:text-base">{rec?.name}</p>
                            <p className="text-orange-600 font-semibold text-sm">Cantidad: {item.multiplier}x</p>
                          </div>
                          <button 
                            onClick={() => removeWeeklyRecipe(item.id)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Lista de Compras Consolidada */}
              {weeklyProduction.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-800 mb-3 border-t pt-4">Totales para Proveeduría</h3>
                  <div className="grid gap-2">
                    {aggregatedList.map((ing, index) => {
                      const isToggled = purchasedIngredients[ing.name];
                      const displayAmount = ing.amount % 1 === 0 ? ing.amount : ing.amount.toFixed(1);
                      
                      return (
                        <div 
                          key={index}
                          onClick={() => togglePurchased(ing.name)}
                          className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            isToggled ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'
                          }`}
                        >
                          {isToggled ? <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" /> : <Circle className="w-5 h-5 text-gray-300 mr-3" />}
                          <div className={`flex-1 text-sm md:text-base font-medium ${isToggled ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                            {ing.name}
                          </div>
                          <div className={`font-bold ${isToggled ? 'text-gray-400' : 'text-orange-600'}`}>
                            {displayAmount} {ing.unit}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>


      {/* APLICACIÓN PRINCIPAL (CALCULADORA DE COCINA) */}
      <div className="max-w-3xl mx-auto p-4 md:p-6 mt-4">
        {/* Encabezado y Selector */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              Calculadora de Recetas
            </h1>
            {/* El Gorro de Chef ahora es un Botón */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 bg-orange-100 rounded-full hover:bg-orange-200 transition-colors shadow-sm"
              title="Abrir Producción Semanal"
            >
              <ChefHat className="text-orange-600 w-7 h-7" />
            </button>
          </div>

          <select 
            className="w-full p-4 text-lg border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none bg-white shadow-sm"
            value={selectedRecipeId}
            onChange={(e) => setSelectedRecipeId(e.target.value)}
          >
            {recipes.map(recipe => (
              <option key={recipe.id} value={recipe.id}>
                {recipe.name} ({recipe.category})
              </option>
            ))}
          </select>
        </div>

        {/* Controles de Multiplicador (Diseño Original) */}
        <div className="bg-orange-50 p-4 rounded-xl mb-6 shadow-sm border border-orange-100">
          <div className="text-center mb-4">
            <span className="text-sm font-semibold text-orange-800 uppercase tracking-wider">Multiplicador</span>
            <div className="text-4xl font-bold text-orange-600 mt-1">{multiplier}x</div>
          </div>
          
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {quickMultipliers.map(mult => (
              <button
                key={mult}
                onClick={() => setMultiplier(mult)}
                className={`flex-1 py-3 px-4 rounded-lg font-bold text-lg transition-colors ${
                  multiplier === mult 
                    ? 'bg-orange-500 text-white shadow-md' 
                    : 'bg-white text-orange-600 border border-orange-200'
                }`}
              >
                {mult}x
              </button>
            ))}
          </div>

          <input 
            type="range" 
            min="0.5" 
            max="5" 
            step="0.5" 
            value={multiplier}
            onChange={(e) => setMultiplier(parseFloat(e.target.value))}
            className="w-full accent-orange-500 h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Lista de Ingredientes (Diseño Original) */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 text-gray-800">Ingredientes Ajustados</h2>
          <div className="grid gap-2">
            {selectedRecipe?.ingredients.map((ing, index) => {
              const isToggled = toggledIngredients[index];
              const calculatedQuantity = (ing.baseQuantity * multiplier).toFixed(1).replace(/\.0$/, '');
              
              return (
                <div 
                  key={index}
                  onClick={() => toggleIngredient(index)}
                  className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all bg-white shadow-sm ${
                    isToggled ? 'border-green-200' : 'border-gray-100 hover:border-orange-200'
                  }`}
                >
                  {isToggled ? <CheckCircle2 className="w-6 h-6 text-green-500 mr-3" /> : <Circle className="w-6 h-6 text-gray-300 mr-3" />}
                  <div className={`flex-1 text-lg ${isToggled ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                    {ing.name}
                  </div>
                  <div className={`text-xl font-bold ${isToggled ? 'text-gray-400' : 'text-orange-600'}`}>
                    {calculatedQuantity} {ing.unit}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tip de Cocina */}
        {selectedRecipe?.tip && (
          <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg shadow-sm">
            <p className="text-blue-800 text-sm md:text-base"><strong>Tip:</strong> {selectedRecipe.tip}</p>
          </div>
        )}

        {/* Paso a Paso de la Preparación */}
        {selectedRecipe?.steps && (
          <div className="mt-6 mb-8">
            <h2 className="text-xl font-bold mb-3 text-gray-800">Preparación</h2>
            <div className="grid gap-2">
              {selectedRecipe.steps.map((step, index) => {
                const isToggled = toggledSteps[index];
                return (
                  <div
                    key={index}
                    onClick={() => toggleStep(index)}
                    className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all bg-white shadow-sm ${
                      isToggled ? 'border-green-200' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isToggled ? <CheckCircle2 className="w-6 h-6 text-green-500 mr-3" /> : <Circle className="w-6 h-6 text-gray-300 mr-3" />}
                    </div>
                    <div className={`flex-1 text-base md:text-lg ${isToggled ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                      <span className="font-bold mr-2">{index + 1}.</span>
                      {step}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
