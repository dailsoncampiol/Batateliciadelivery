'use client';

import React, { useState } from 'react';
import { ShoppingBag, Clock, MapPin, Search, Plus, Minus, X, Trash2, CheckCircle } from 'lucide-react';

// ==========================================
// 1. CONFIGURAÇÕES E DADOS DO CARDÁPIO
// ==========================================
const STORE_CONFIG = {
name: "Batatas Recheadas Batatelícia",
whatsappNumber: "5519998730304",
minOrderValue: 24.90,
openingHour: "17:00",
address: "Rua do Rosário, 207, Mogi Mirim - SP",
deliveryTiers: [
{ maxKm: 3.0, fee: 5.00 },
{ maxKm: 5.0, fee: 10.00 },
{ maxKm: 7.0, fee: 15.00 },
{ maxKm: Infinity, fee: 20.00 }
]
};

interface Addition {
id: string;
name: string;
price: number;
}

interface Product {
id: string;
name: string;
description: string;
price: number;
category: 'destaques' | 'combos' | 'batatas' | 'porcoes' | 'sobremesas' | 'bebidas';
image: string;
serves?: string;
isCombo?: boolean;
comboItemsCount?: number;
comboIncludesDrink?: boolean;
editablePriceNotice?: string;
}

const ADDITIONS_LIST: Addition[] = [
{ id: 'bacon', name: 'Bacon extra', price: 6.00 },
{ id: 'mussarela', name: 'Mussarela extra', price: 6.00 },
{ id: 'cheddar', name: 'Cheddar extra', price: 6.00 },
{ id: 'catupiry', name: 'Requeijão extra', price: 6.00 },
{ id: 'cream_cheese', name: 'Cream Cheese extra', price: 7.00 },
{ id: 'batata_palha', name: 'Batata Palha extra', price: 4.00 },
{ id: 'alho_frito', name: 'Alho frito', price: 3.00 },
];

const PRODUCTS: Product[] = [
{
id: 'frango-cremoso',
name: 'Batata Recheada de Frango Cremoso',
description: 'Batata amassada e temperada, sem casca, recheada com frango desfiado bem cremoso e suculento, finalizada com uma generosa camada de mussarela maçaricada.',
price: 34.99,
category: 'batatas',
image: '/images/frango-cremoso.jpg',
serves: 'Serve 1 pessoa'
},
{
id: 'frango-cream-cheese',
name: 'Batata Recheada de Frango com Cream Cheese',
description: 'Batata amassada e temperada, sem casca, recheada com frango desfiado bem cremoso e suculento e o delicioso cream cheese.',
price: 34.99,
category: 'batatas',
image: '/images/frango-cream-cheese.png',
serves: 'Serve 1 pessoa'
},
{
id: 'strogonoff-frango',
name: 'Batata Recheada de Strogonoff de Frango',
description: 'Batata amassada e temperada, sem casca, recheada com strogonoff de frango, seguida por uma camada de mussarela maçaricada. Batata palha enviada à parte.',
price: 35.99,
category: 'batatas',
image: '/images/placeholder.jpg',
serves: 'Serve 1 pessoa'
},
{
id: 'brocolis-bacon',
name: 'Batata Recheada de Brócolis e Bacon',
description: 'Batata amassada e temperada, sem casca, recheada com brócolis e bacon ao molho branco à base de creme de leite e requeijão cremoso, finalizada com mussarela maçaricada.',
price: 36.99,
category: 'batatas',
image: '/images/placeholder.jpg',
serves: 'Serve 1 pessoa'
},
{
id: 'brocolis-especial',
name: 'Batata Recheada de Brócolis Especial (Vegetariana)',
description: 'Batata amassada e temperada, sem casca, recheada com requeijão cremoso original e brócolis ao molho branco, finalizada com mussarela maçaricada e alho frito salteado.',
price: 36.99,
category: 'batatas',
image: '/images/placeholder.jpg',
serves: 'Serve 1 pessoa (Opção Vegetariana)'
},
{
id: 'pizza',
name: 'Batata Recheada de Pizza',
description: 'Batata amassada e temperada, sem casca, recheada com presunto, mussarela ralada e tomate em cubinhos, com um toque de orégano, finalizada com mais mussarela.',
price: 36.99,
category: 'batatas',
image: '/images/placeholder.jpg',
serves: 'Serve 1 pessoa'
},
{
id: 'caipira',
name: 'Batata Recheada Caipira',
description: 'Batata amassada e temperada, sem casca, recheada com frango desfiado, milho verde, bacon em cubinhos e mussarela maçaricada para finalizar.',
price: 36.99,
category: 'batatas',
image: '/images/placeholder.jpg',
serves: 'Serve 1 pessoa'
},
{
id: '3-queijos',
name: 'Batata Recheada de 3 Queijos',
description: 'Batata amassada e temperada, sem casca, recheada com requeijão, cheddar e mussarela.',
price: 36.99,
category: 'batatas',
image: '/images/placeholder.jpg',
serves: 'Serve 1 pessoa'
},
{
id: 'queijo-bacon',
name: 'Batata Recheada de Queijo e Bacon',
description: 'Batata amassada e temperada, sem casca, recheada com um delicioso creme de queijo mussarela e bacon em cubinhos crocantes.',
price: 37.99,
category: 'batatas',
image: '/images/placeholder.jpg',
serves: 'Serve 1 pessoa'
},
{
id: 'cheddar-bacon',
name: 'Batata Recheada de Cheddar e Bacon',
description: 'Batata amassada e temperada, sem casca, recheada com creme de cheddar e cubinhos de bacon crocantes, finalizada com mais cheddar.',
price: 37.99,
category: 'batatas',
image: '/images/placeholder.jpg',
serves: 'Serve 1 pessoa'
},
{
id: 'strogonoff-carne',
name: 'Batata Recheada de Strogonoff de Carne',
description: 'Batata amassada e temperada, sem casca, recheada com strogonoff de carne, seguida por uma camada de mussarela maçaricada. Batata palha enviada à parte.',
price: 39.99,
category: 'batatas',
image: '/images/placeholder.jpg',
serves: 'Serve 1 pessoa',
editablePriceNotice: 'Preço provisório. Confirmar no painel administrativo antes da publicação.'
},
{
id: 'combo-individual',
name: 'Combo Individual',
description: '1 batata recheada + 1 refrigerante em lata. Uma refeição prática para uma pessoa.',
price: 38.99,
category: 'combos',
image: '/images/placeholder.jpg',
serves: 'Serve 1 pessoa',
isCombo: true,
comboItemsCount: 1,
comboIncludesDrink: true
},
{
id: 'combo-casal',
name: 'Combo Casal',
description: '2 batatas recheadas + 1 refrigerante de 2 litros.',
price: 76.99,
category: 'combos',
image: '/images/placeholder.jpg',
serves: 'Serve 2 pessoas',
isCombo: true,
comboItemsCount: 2,
comboIncludesDrink: true
},
{
id: 'combo-familia-01',
name: 'Combo Família 01',
description: '3 batatas recheadas + 1 Coca-Cola de 2 litros.',
price: 114.99,
category: 'combos',
image: '/images/placeholder.jpg',
serves: 'Serve 3 pessoas',
isCombo: true,
comboItemsCount: 3,
comboIncludesDrink: true
},
{
id: 'combo-familia-02',
name: 'Combo Família 02 (4 pessoas)',
description: '4 batatas recheadas + 1 porção de fritas de 250 g + 1 Coca-Cola de 2 litros.',
price: 162.99,
category: 'combos',
image: '/images/placeholder.jpg',
serves: 'Serve 4 pessoas',
isCombo: true,
comboItemsCount: 4,
comboIncludesDrink: true
},
{
id: 'mini-churros',
name: 'Mini Churros de Doce de Leite',
description: 'Deliciosos mini churros recheados com doce de leite cremoso.',
price: 14.99,
category: 'sobremesas',
image: '/images/placeholder.jpg',
serves: 'Porção individual'
}
];

interface CartItem {
cartId: string;
product: Product;
quantity: number;
additions: Addition[];
observation: string;
unitTotal: number;
}

export default function DeliveryApp() {
const [selectedCategory, setSelectedCategory] = useState('todos');
const [searchQuery, setSearchQuery] = useState('');
const [cart, setCart] = useState<CartItem[]>([]);
const [isCartOpen, setIsCartOpen] = useState(false);
const [selectedProductModal, setSelectedProductModal] = useState<Product | null>(null);

// Estados da Modal de Adicionar Produto
const [modalQuantity, setModalQuantity] = useState(1);
const [selectedAdditions, setSelectedAdditions] = useState<Addition[]>([]);
const [modalObs, setModalObs] = useState('');

// Estados do Checkout e Frete
const [street, setStreet] = useState('');
const [number, setNumber] = useState('');
const [neighborhood, setNeighborhood] = useState('');
const [distanceKm, setDistanceKm] = useState<number | null>(null);
const [deliveryFee, setDeliveryFee] = useState(0);
const [paymentMethod, setPaymentMethod] = useState<'Pix' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Dinheiro'>('Pix');
const [needChange, setNeedChange] = useState(false);
const [changeFor, setChangeFor] = useState('');

// Filtragem de Produtos
const filteredProducts = PRODUCTS.filter(product => {
const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory;
const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
product.description.toLowerCase().includes(searchQuery.toLowerCase());
return matchesCategory && matchesSearch;
});

// Modal handlers
const handleOpenProduct = (product: Product) => {
setSelectedProductModal(product);
setModalQuantity(1);
setSelectedAdditions([]);
setModalObs('');
};

const toggleAddition = (addition: Addition) => {
if (selectedAdditions.some(a => a.id === addition.id)) {
setSelectedAdditions(selectedAdditions.filter(a => a.id !== addition.id));
} else {
setSelectedAdditions([...selectedAdditions, addition]);
}
};

const calculateModalUnitPrice = () => {
if (!selectedProductModal) return 0;
const additionsTotal = selectedAdditions.reduce((acc, curr) => acc + curr.price, 0);
return selectedProductModal.price + additionsTotal;
};

const handleAddToCart = () => {
if (!selectedProductModal) return;
const unitPrice = calculateModalUnitPrice();
const newItem: CartItem = {
cartId: ${selectedProductModal.id}-${Date.now()},
product: selectedProductModal,
quantity: modalQuantity,
additions: selectedAdditions,
observation: modalObs,
unitTotal: unitPrice
};
setCart([...cart, newItem]);
setSelectedProductModal(null);
};

const handleRemoveFromCart = (cartId: string) => {
setCart(cart.filter(item => item.cartId !== cartId));
};

const subtotal = cart.reduce((acc, item) => acc + (item.unitTotal * item.quantity), 0);

// Cálculo da Taxa de Entrega por Distância
const handleCalculateFee = (kmValue: number) => {
setDistanceKm(kmValue);
const tier = STORE_CONFIG.deliveryTiers.find(t => kmValue <= t.maxKm);
if (tier) {
setDeliveryFee(tier.fee);
} else {
setDeliveryFee(20.00);
}
};

const grandTotal = subtotal + deliveryFee;

// Formatação do Envio para o WhatsApp
const handleCheckoutWhatsApp = () => {
if (cart.length === 0) return;
if (subtotal < STORE_CONFIG.minOrderValue) {
alert(O valor mínimo do pedido é R$ ${STORE_CONFIG.minOrderValue.toFixed(2).replace('.', ',')});
return;
}
if (!street || !number || !neighborhood) {
alert("Por favor, preencha o endereço completo de entrega.");
return;
}

let message = `*NOVO PEDIDO - ${STORE_CONFIG.name.toUpperCase()}*\n`;
message += `------------------------------------\n\n`;
message += `*ITENS DO PEDIDO:*\n`;

cart.forEach((item, index) => {
  message += `${index + 1}. *${item.quantity}x ${item.product.name}* - R$ ${(item.unitTotal * item.quantity).toFixed(2).replace('.', ',')}\n`;
  if (item.additions.length > 0) {
    message += `   _Adicionais:_ ${item.additions.map(a => a.name).join(', ')}\n`;
  }
  if (item.observation) {
    message += `   _Obs:_ ${item.observation}\n`;
  }
  message += `\n`;
});

message += `------------------------------------\n`;
message += `*RESUMO DO PEDIDO:*\n`;
message += `Subtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
message += `Taxa de Entrega (${distanceKm ? distanceKm + ' km' : 'Padrão'}): R$ ${deliveryFee.toFixed(2).replace('.', ',')}\n`;
message += `*TOTAL: R$ ${grandTotal.toFixed(2).replace('.', ',')}*\n\n`;

message += `*ENDEREÇO DE ENTREGA:*\n`;
message += `${street}, Nº ${number}\n`;
message += `Bairro: ${neighborhood}\n`;
message += `Cidade: Mogi Mirim - SP\n\n`;

message += `*FORMA DE PAGAMENTO:*\n`;
message += `Forma: ${paymentMethod}\n`;
if (paymentMethod === 'Dinheiro' && needChange) {
  message += `Troco para: R$ ${changeFor}\n`;
}

const encodedMessage = encodeURIComponent(message);
window.open(`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodedMessage}`, '_blank');


};

return (

{/* HEADER / BANNER */}




{STORE_CONFIG.name}
{STORE_CONFIG.address}




Abre às {STORE_CONFIG.openingHour}



Entrega em Mogi Mirim






  {/* BUSCA E CATEGORIAS */}
  <main className="max-w-4xl mx-auto px-4 mt-6">
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      <input
        type="text"
        placeholder="Buscar batata recheada, combo ou bebida..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-600 bg-white shadow-sm"
      />
    </div>

    {/* NAVEGAÇÃO DE CATEGORIAS */}
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-6">
      {[
        { id: 'todos', label: 'Cardápio Completo' },
        { id: 'combos', label: 'Combos' },
        { id: 'batatas', label: 'Batatas Recheadas' },
        { id: 'sobremesas', label: 'Sobremesas' }
      ].map(cat => (
        <button
          key={cat.id}
          onClick={() => setSelectedCategory(cat.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            selectedCategory === cat.id
              ? 'bg-red-700 text-white shadow-sm'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>

    {/* LISTA DE PRODUTOS */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {filteredProducts.map(product => (
        <div
          key={product.id}
          onClick={() => handleOpenProduct(product)}
          className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between gap-3"
        >
          <div>
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-bold text-gray-900 text-base">{product.name}</h3>
              <span className="text-red-700 font-bold whitespace-nowrap">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
            </div>
            {product.serves && (
              <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded mt-1">
                {product.serves}
              </span>
            )}
            <p className="text-gray-500 text-xs mt-2 line-clamp-3">{product.description}</p>
            {product.editablePriceNotice && (
              <p className="text-xs text-amber-600 font-medium mt-1">
                ⚠️ {product.editablePriceNotice}
              </p>
            )}
          </div>
          <button className="w-full mt-2 bg-red-50 text-red-700 font-semibold text-xs py-2 rounded-lg border border-red-200 flex items-center justify-center gap-1 hover:bg-red-100 transition-colors">
            <Plus size={14} /> Adicionar ao Pedido
          </button>
        </div>
      ))}
    </div>
  </main>

  {/* MODAL SELEÇÃO DE PRODUTO & ADICIONAIS */}
  {selectedProductModal && (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-xl">
        <button
          onClick={() => setSelectedProductModal(null)}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-gray-900 pr-6">{selectedProductModal.name}</h2>
        <p className="text-gray-600 text-sm mt-1">{selectedProductModal.description}</p>
        <p className="text-lg font-bold text-red-700 mt-2">
          R$ {selectedProductModal.price.toFixed(2).replace('.', ',')}
        </p>

        {/* ADICIONAIS */}
        <div className="mt-6 border-t border-gray-100 pt-4">
          <h4 className="font-semibold text-sm text-gray-800 mb-2">Deseja Adicionais?</h4>
          <div className="space-y-2">
            {ADDITIONS_LIST.map(addition => {
              const isChecked = selectedAdditions.some(a => a.id === addition.id);
              return (
                <div
                  key={addition.id}
                  onClick={() => toggleAddition(addition)}
                  className={`flex justify-between items-center p-3 rounded-lg border cursor-pointer text-sm transition-colors ${
                    isChecked ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="text-red-600 focus:ring-red-500 rounded"
                    />
                    <span>{addition.name}</span>
                  </div>
                  <span className="font-medium text-gray-700">
                    + R$ {addition.price.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* OBSERVAÇÃO */}
        <div className="mt-4">
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Observações (ex: retirar cebola, sem tempero)
          </label>
          <textarea
            value={modalObs}
            onChange={(e) => setModalObs(e.target.value)}
            placeholder="Alguma instrução especial para o seu item?"
            className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-600"
            rows={2}
          />
        </div>

        {/* CONTADOR DE QUANTIDADE E ADICIONAR */}
        <div className="mt-6 flex items-center gap-4 border-t border-gray-100 pt-4">
          <div className="flex items-center border border-gray-200 rounded-lg">
            <button
              onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-l-lg"
            >
              <Minus size={16} />
            </button>
            <span className="px-4 text-sm font-bold">{modalQuantity}</span>
            <button
              onClick={() => setModalQuantity(modalQuantity + 1)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-r-lg"
            >
              <Plus size={16} />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex-1 bg-red-700 text-white font-bold py-3 rounded-lg text-sm hover:bg-red-800 transition-colors flex items-center justify-center justify-between px-4"
          >
            <span>Adicionar</span>
            <span>R$ {(calculateModalUnitPrice() * modalQuantity).toFixed(2).replace('.', ',')}</span>
          </button>
        </div>
      </div>
    </div>
  )}

  {/* BARRA FIXA INFERIOR DO CARRINHO */}
  {cart.length > 0 && (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40">
      <div className="max-w-4xl mx-auto flex justify-between items-center gap-4">
        <div>
          <span className="text-xs text-gray-500">Total do Pedido</span>
          <p className="text-lg font-bold text-gray-900">
            R$ {subtotal.toFixed(2).replace('.', ',')}
          </p>
        </div>
        <button
          onClick={() => setIsCartOpen(true)}
          className="bg-red-700 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 text-sm hover:bg-red-800 transition-colors shadow-md"
        >
          <ShoppingBag size={18} />
          <span>Ver Sacola ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
        </button>
      </div>
    </div>
  )}

  {/* DRAWER / MODAL DO CARRINHO & CHECKOUT */}
  {isCartOpen && (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto p-6 flex flex-col justify-between relative">
        <div>
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ShoppingBag size={20} className="text-red-700" /> Seu Pedido
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          {/* LISTA DE ITENS */}
          <div className="divide-y divide-gray-100 my-4">
            {cart.map(item => (
              <div key={item.cartId} className="py-3 flex justify-between items-start">
                <div className="flex-1 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-red-700">{item.quantity}x</span>
                    <span className="font-semibold text-sm text-gray-800">{item.product.name}</span>
                  </div>
                  {item.additions.length > 0 && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      + {item.additions.map(a => a.name).join(', ')}
                    </p>
                  )}
                  {item.observation && (
                    <p className="text-xs text-gray-400 italic mt-0.5">Obs: {item.observation}</p>
                  )}
                  <p className="text-xs font-bold text-gray-700 mt-1">
                    R$ {(item.unitTotal * item.quantity).toFixed(2).replace('.', ',')}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveFromCart(item.cartId)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* CÁLCULO DE FRETE */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mt-4">
            <h4 className="font-bold text-xs text-gray-700 uppercase tracking-wider mb-2">
              Calcular Entrega em Mogi Mirim
            </h4>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { label: 'Até 3km', km: 2.5, fee: 'R$ 5,00' },
                { label: '3km - 5km', km: 4.5, fee: 'R$ 10,00' },
                { label: '5km - 7km', km: 6.5, fee: 'R$ 15,00' }
              ].map((tier, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCalculateFee(tier.km)}
                  className={`p-2 rounded-lg border text-center font-medium transition-colors ${
                    distanceKm === tier.km
                      ? 'border-red-600 bg-red-50 text-red-700'
                      : 'border-gray-200 bg-white text-gray-600'
                  }`}
                >
                  <div>{tier.label}</div>
                  <div className="font-bold">{tier.fee}</div>
                </button>
              ))}
            </div>
          </div>

          {/* FORMULÁRIO DE ENDEREÇO */}
          <div className="mt-4 space-y-3">
            <h4 className="font-bold text-xs text-gray-700 uppercase tracking-wider">Endereço de Entrega</h4>
            <input
              type="text"
              placeholder="Rua / Avenida"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-red-600"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Número"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-red-600"
              />
              <input
                type="text"
                placeholder="Bairro"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>
          </div>

          {/* PAGAMENTO */}
          <div className="mt-4">
            <h4 className="font-bold text-xs text-gray-700 uppercase tracking-wider mb-2">Forma de Pagamento</h4>
            <select
              value={paymentMethod}
              onChange={(e: any) => setPaymentMethod(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-red-600 bg-white"
            >
              <option value="Pix">Pix (Chave enviada no WhatsApp)</option>
              <option value="Cartão de Crédito">Cartão de Crédito (Entrega)</option>
              <option value="Cartão de Débito">Cartão de Débito (Entrega)</option>
              <option value="Dinheiro">Dinheiro</option>
            </select>

            {paymentMethod === 'Dinheiro' && (
              <div className="mt-2 space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <label className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                  <input
                    type="checkbox"
                    checked={needChange}
                    onChange={(e) => setNeedChange(e.target.checked)}
                    className="text-red-600 focus:ring-red-500 rounded"
                  />
                  Precisa de troco?
                </label>
                {needChange && (
                  <input
                    type="text"
                    placeholder="Troco para quanto? Ex: R$ 50,00"
                    value={changeFor}
                    onChange={(e) => setChangeFor(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-red-600 bg-white"
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* RESUMO DE VALORES E BOTÃO DE FINALIZAR */}
        <div className="border-t border-gray-100 pt-4 mt-6">
          <div className="space-y-1 text-sm mb-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Taxa de Entrega:</span>
              <span>R$ {deliveryFee.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex justify-between font-bold text-base text-gray-900 pt-2 border-t border-gray-100">
              <span>Total:</span>
              <span className="text-red-700">R$ {grandTotal.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          <button
            onClick={handleCheckoutWhatsApp}
            className="w-full bg-green-600 text-white font-bold py-3.5 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm shadow-md"
          >
            <CheckCircle size={18} />
            <span>FINALIZAR PEDIDO PELO WHATSAPP</span>
          </button>
        </div>
      </div>
    </div>
  )}
</div>


);
}