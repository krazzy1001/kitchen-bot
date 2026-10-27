"use client";

import React, { useState, useEffect } from 'react';
import { Minus, Plus, CheckCircle2, Circle, ChefHat } from 'lucide-react';

// 1. AQUÍ AGREGAS TUS RECETAS (Nota los nuevos campos 'tip' y 'steps')
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
  const [selectedRecipeId, setSelectedRecipeId] = useState(recipes[0].id);
  const [multiplier, setMultiplier] = useState(1);
  const [toggledIngredients, setToggledIngredients] = useState({});
  const [toggledSteps, setToggledSteps] = useState({}); // Nuevo estado para los pasos

  const selectedRecipe = recipes.find(r => r.id === selectedRecipeId);

  // Reiniciar los tachados si cambian de receta
  useEffect(() => {
    setToggledIngredients({});
    setToggledSteps({});
  }, [selectedRecipeId]);

  const toggleIngredient = (index) => {
    setToggledIngredients(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleStep = (index) => {
    setToggledSteps(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const quickMultipliers = [0.5, 1, 1.5, 2, 3];

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 bg-white shadow-lg rounded-xl mt-4">
      {/* Encabezado y Selector */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <ChefHat className="text-orange-500" />
          Calculadora de Recetas
        </h1>
        <select 
          className="w-full p-4 text-lg border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
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

      {/* Controles de Multiplicador */}
      <div className="bg-orange-50 p-4 rounded-xl mb-6">
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
                  ? 'bg-orange-500 text-white' 
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

      {/* Lista de Ingredientes */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-3 text-gray-800">Ingredientes Ajustados</h2>
        <div className="grid gap-2">
          {selectedRecipe.ingredients.map((ing, index) => {
            const isToggled = toggledIngredients[index];
            const calculatedQuantity = (ing.baseQuantity * multiplier).toFixed(1).replace(/\.0$/, '');
            
            return (
              <div 
                key={index}
                onClick={() => toggleIngredient(index)}
                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  isToggled ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100 hover:border-orange-200'
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
      {selectedRecipe.tip && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6">
          <p className="text-blue-800 text-sm md:text-base"><strong>Tip:</strong> {selectedRecipe.tip}</p>
        </div>
      )}

      {/* Paso a Paso de la Preparación */}
      {selectedRecipe.steps && (
        <div>
          <h2 className="text-xl font-bold mb-3 text-gray-800">Preparación</h2>
          <div className="grid gap-2">
            {selectedRecipe.steps.map((step, index) => {
              const isToggled = toggledSteps[index];
              return (
                <div 
                  key={index}
                  onClick={() => toggleStep(index)}
                  className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    isToggled ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100 hover:border-orange-200'
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
  );
}
