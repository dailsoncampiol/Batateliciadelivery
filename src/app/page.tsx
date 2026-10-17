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
              <p className="text-xs text-neutral-400 flex items-center
