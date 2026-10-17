'use client';

import React, { useState, useMemo } from 'react';
import { ShoppingCart, MapPin, Send, Trash2, Plus, Minus, Search, Phone, Clock, AlertCircle } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
  observation?: string;
}

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Batata Recheada de Frango Cremoso',
    description: 'Batata assada grande com recheio abundante de frango desfiado, catupiry original, milho e batata palha crocante.',
    price: 32.90,
    category: 'Mais Vendidas',
    image: '/images/frango-cremoso.jpg'
  },
  {
    id: '2',
    name: 'Batata Recheada de Carne Seca com Cream Cheese',
    description: 'Carne seca desfiada e temperada, cream cheese cremoso, queijo derretido e cheiro-verde fresco.',
    price: 38.90,
    category: 'Mais Vendidas',
    image: '/images/frango-cream-cheese.png'
  },
  {
    id: '3',
    name: 'Batata Recheada de Strogonoff de Carne',
    description: 'Strogonoff de carne macia com cogumelos, molho aveludado e bastante batata palha por cima.',
    price: 36.50,
    category: 'Especiais',
    image: '/images/strogonoff-carne.jpg'
  },
  {
    id: '4',
    name: 'Batata Recheada Vegetariana',
    description: 'Brócolis na manteiga, queijo mussarela derretido, requeijão, milho e azeitonas pretas.',
    price: 29.90,
    category: 'Vegetarianas',
    image: '/images/vegetariana.jpg'
  },
  {
    id: '5',
    name: 'Batata Recheada 4 Queijos',
    description: 'Mussarela, provolone, catupiry e gorgonzola derretidos e gratinados.',
    price: 34.00,
    category: 'Especiais',
    image: '/images/quatro-queijos.jpg'
  }
];

const DELIVERY_ZONES = [
  { distance: 'Até 3 km', fee: 5.00 },
  { distance: 'De 3 km a 6 km', fee: 8.00 },
  { distance: 'De 6 km a 10 km', fee: 12.00 },
];

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [address, setAddress] = useState({
    street: '',
    number: '',
    neighborhood: '',
    complement: '',
    reference: ''
  });
  const [selectedZone, setSelectedZone] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('Pix');
  const [needChange, setNeedChange] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');

  const categories = ['Todas', ...Array.from(new Set(PRODUCTS.map(p => p.category)))];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const updateObservation = (id: string, observation: string) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, observation } : item));
  };

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const deliveryFee = DELIVERY_ZONES[selectedZone].fee;
  const total = subtotal + deliveryFee;

  const handleSendOrder = () => {
    if (!customerName.trim()) {
      alert('Por favor, informe seu nome.');
      return;
    }
    if (!address.street.trim() || !address.number.trim() || !address.neighborhood.trim()) {
      alert('Por favor, preencha os campos obrigatórios do endereço (Rua, Número e Bairro).');
      return;
    }
    if (cart.length === 0) {
      alert('Seu carrinho está vazio.');
      return;
    }

    let itemsText = cart.map(item => {
      let line = `• ${item.quantity}x ${item.name} (R$ ${(item.price * item.quantity).toFixed(2)})`;
      if (item.observation) {
        line += `\n  Obs: ${item.observation}`;
      }
      return line;
    }).join('\n');

    let text = `*NOVO PEDIDO - BATATELÍCIA BATATARIA*\n\n`;
    text += `*Cliente:* ${customerName}\n`;
    text += `------------------------------------\n`;
    text += `*ITENS DO PEDIDO:*\n${itemsText}\n\n`;
    text += `------------------------------------\n`;
    text += `*Subtotal:* R$ ${subtotal.toFixed(2)}\n`;
    text += `*Taxa de Entrega (${DELIVERY_ZONES[selectedZone].distance}):* R$ ${deliveryFee.toFixed(2)}\n`;
    text += `*TOTAL:* R$ ${total.toFixed(2)}\n\n`;
    text += `------------------------------------\n`;
    text += `*ENDEREÇO DE ENTREGA:*\n`;
    text += `${address.street}, Nº ${address.number}\n`;
    text += `Bairro: ${address.neighborhood}\n`;
    if (address.complement) text += `Complemento: ${address.complement}\n`;
    if (address.reference) text += `Referência: ${address.reference}\n`;
    text += `\n*FORMA DE PAGAMENTO:*\n${paymentMethod}`;
    if (paymentMethod === 'Dinheiro' && needChange) {
      text += ` (Troco para R$ ${needChange})`;
    }

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/5519998730304?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 font-sans">
      {/* Header */}
      <header className="bg-neutral-950 border-b border-neutral-800 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center font-bold text-xl text-yellow-400 border-2 border-yellow-400">
              BB
            </div>
            <div>
              <h1 className="text-xl font-bold text-red-500 tracking-wide">Batatelícia Batataria</h1>
              <p className="text-xs text-neutral-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-yellow-500" /> Rua do Rosário, 207
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-neutral-300">
            <div className="flex items-center gap-1.5 bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800">
              <Clock className="w-4 h-4 text-yellow-500" />
              <span>Aberto agora</span>
            </div>
            <div className="flex items-center gap-1.5 bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800">
              <Phone className="w-4 h-4 text-green-500" />
              <span>(19) 99873-0304</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Menu Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input
                type="text"
                placeholder="Buscar batata recheada..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-red-600 text-white'
                      : 'bg-neutral-950 text-neutral-400 hover:bg-neutral-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between hover:border-neutral-700 transition-colors">
                <div>
                  <div className="h-40 bg-neutral-900 rounded-lg mb-3 overflow-hidden relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <h3 className="font-semibold text-neutral-100 text-sm mb-1">{product.name}</h3>
                  <p className="text-xs text-neutral-400 line-clamp-2 mb-3">{product.description}</p>
                </div>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-neutral-900">
                  <span className="font-bold text-yellow-500 text-sm">R$ {product.price.toFixed(2)}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart & Checkout Section */}
        <div className="space-y-6">
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 sticky top-24">
            <h2 className="text-base font-bold text-neutral-100 flex items-center gap-2 mb-4 border-b border-neutral-800 pb-3">
              <ShoppingCart className="w-5 h-5 text-red-500" /> Seu Carrinho
            </h2>

            {cart.length === 0 ? (
              <p className="text-xs text-neutral-500 text-center py-8">Seu carrinho está vazio.</p>
            ) : (
              <div className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cart.map(item => (
                    <div key={item.id} className="bg-neutral-900 p-3 rounded-lg text-xs space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-neutral-200">{item.name}</span>
                        <span className="font-bold text-yellow-500">R$ {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-neutral-950 rounded border border-neutral-800 px-2 py-0.5">
                          <button onClick={() => updateQuantity(item.id, -1)} className="text-neutral-400 hover:text-white">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="text-neutral-400 hover:text-white">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <input
                        type="text"
                        placeholder="Observações (ex: sem cebola)"
                        value={item.observation || ''}
                        onChange={e => updateObservation(item.id, e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-[11px] focus:outline-none focus:border-red-500"
                      />
                    </div>
                  ))}
                </div>

                {/* Form Details */}
                <div className="space-y-3 pt-3 border-t border-neutral-800 text-xs">
                  <div>
                    <label className="block text-neutral-400 mb-1">Seu Nome *</label>
                    <input
                      type="text"
                      placeholder="Como podemos te chamar?"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-neutral-400 font-medium">Endereço de Entrega *</label>
                    <input
                      type="text"
                      placeholder="Rua / Avenida"
                      value={address.street}
                      onChange={e => setAddress({ ...address, street: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-1.5 focus:outline-none focus:border-red-500"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Número"
                        value={address.number}
                        onChange={e => setAddress({ ...address, number: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-1.5 focus:outline-none focus:border-red-500"
                      />
                      <input
                        type="text"
                        placeholder="Bairro"
                        value={address.neighborhood}
                        onChange={e => setAddress({ ...address, neighborhood: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-1.5 focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Complemento (Apt, Bloco)"
                      value={address.complement}
                      onChange={e => setAddress({ ...address, complement: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-1.5 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">Região de Entrega *</label>
                    <select
                      value={selectedZone}
                      onChange={e => setSelectedZone(Number(e.target.value))}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 focus:outline-none focus:border-red-500"
                    >
                      {DELIVERY_ZONES.map((zone, idx) => (
                        <option key={idx} value={idx}>
                          {zone.distance} - R$ {zone.fee.toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">Forma de Pagamento</label>
                    <select
                      value={paymentMethod}
                      onChange={e => setPaymentMethod(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 focus:outline-none focus:border-red-500"
                    >
                      <option value="Pix">Pix (Chave informada no WhatsApp)</option>
                      <option value="Cartão de Débito">Cartão de Débito (Na entrega)</option>
                      <option value="Cartão de Crédito">Cartão de Crédito (Na entrega)</option>
                      <option value="Dinheiro">Dinheiro</option>
                    </select>
                  </div>

                  {paymentMethod === 'Dinheiro' && (
                    <div>
                      <label className="block text-neutral-400 mb-1">Troco para quanto?</label>
                      <input
                        type="text"
                        placeholder="Ex: 50,00"
                        value={needChange}
                        onChange={e => setNeedChange(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-1.5 focus:outline-none focus:border-red-500"
                      />
                    </div>
                  )}

                  {/* Summary */}
                  <div className="pt-3 border-t border-neutral-800 space-y-1.5">
                    <div className="flex justify-between text-neutral-400">
                      <span>Subtotal</span>
                      <span>R$ {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>Taxa de entrega</span>
                      <span>R$ {deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-neutral-100 text-sm pt-1 border-t border-neutral-800">
                      <span>Total</span>
                      <span className="text-yellow-500">R$ {total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSendOrder}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors mt-4 text-sm"
                  >
                    <Send className="w-4 h-4" /> Enviar Pedido via WhatsApp
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
