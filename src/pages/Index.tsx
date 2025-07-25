import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';  
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  age: string;
  gender: string;
  sport: string;
  sizes: string[];
  isNew?: boolean;
  discount?: number;
  description?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

const sampleProducts: Product[] = [
  {
    id: 1,
    name: 'Профессиональные кроссовки для бега',
    price: 8999,
    originalPrice: 12999,
    image: '/img/d256192e-cce0-40c9-8bf0-845b47ff0f8a.jpg',
    category: 'Обувь',
    age: 'Взрослые',
    gender: 'Унисекс',
    sport: 'Бег',
    sizes: ['36', '37', '38', '39', '40', '41', '42', '43'],
    discount: 31,
    description: 'Высокотехнологичные кроссовки с амортизацией для профессионального бега. Легкие, дышащие, с улучшенной поддержкой стопы.'
  },
  {
    id: 2,
    name: 'Детский баскетбольный мяч',
    price: 2499,
    image: '/img/d256192e-cce0-40c9-8bf0-845b47ff0f8a.jpg',
    category: 'Мячи',
    age: 'Дети',
    gender: 'Унисекс',
    sport: 'Баскетбол',
    sizes: ['Размер 5'],
    isNew: true,
    description: 'Качественный баскетбольный мяч для детей. Отличное сцепление, долговечный материал, подходит для игры в зале и на улице.'
  },
  {
    id: 3,
    name: 'Женская спортивная форма',
    price: 4599,
    image: '/img/d256192e-cce0-40c9-8bf0-845b47ff0f8a.jpg',
    category: 'Одежда',
    age: 'Взрослые',
    gender: 'Женский',
    sport: 'Фитнес',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Удобная и стильная спортивная форма для женщин. Изготовлена из дышащих материалов, обеспечивает свободу движений во время тренировок.'
  },
  {
    id: 4,
    name: 'Гантели набор 2 кг',
    price: 1899,
    image: '/img/d256192e-cce0-40c9-8bf0-845b47ff0f8a.jpg',
    category: 'Тренажеры',
    age: 'Взрослые',
    gender: 'Унисекс',
    sport: 'Фитнес',
    sizes: ['2 кг'],
    description: 'Компактные гантели для домашних тренировок. Удобная рукоятка с антискользящим покрытием, идеально подходят для силовых упражнений.'
  },
  {
    id: 5,
    name: 'Детские плавательные очки',
    price: 899,
    image: '/img/d256192e-cce0-40c9-8bf0-845b47ff0f8a.jpg',
    category: 'Аксессуары',
    age: 'Дети',
    gender: 'Унисекс',
    sport: 'Плавание',
    sizes: ['Универсальный'],
    isNew: true,
    description: 'Яркие и удобные плавательные очки для детей. Защита от UV-лучей, регулируемый ремешок, не давят на переносицу.'
  },
  {
    id: 6,
    name: 'Мужская футболка для тренировок',
    price: 2199,
    originalPrice: 2999,
    image: '/img/d256192e-cce0-40c9-8bf0-845b47ff0f8a.jpg',
    category: 'Одежда',
    age: 'Взрослые',
    gender: 'Мужской',
    sport: 'Фитнес',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    discount: 27,
    description: 'Технологичная мужская футболка для интенсивных тренировок. Отводит влагу, быстро сохнет, не сковывает движения.'
  }
];

export default function Index() {
  const [filteredProducts, setFilteredProducts] = useState(sampleProducts);
  const [filters, setFilters] = useState({
    age: '',
    gender: '',
    sport: '',
    category: ''
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [animatedElements, setAnimatedElements] = useState<Set<string>>(new Set());

  const filterProducts = (newFilters: typeof filters) => {
    let filtered = sampleProducts;
    
    if (newFilters.age) {
      filtered = filtered.filter(product => product.age === newFilters.age);
    }
    if (newFilters.gender) {
      filtered = filtered.filter(product => product.gender === newFilters.gender || product.gender === 'Унисекс');
    }
    if (newFilters.sport) {
      filtered = filtered.filter(product => product.sport === newFilters.sport);
    }
    if (newFilters.category) {
      filtered = filtered.filter(product => product.category === newFilters.category);
    }
    
    setFilteredProducts(filtered);
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    filterProducts(newFilters);
  };

  const clearFilters = () => {
    setFilters({ age: '', gender: '', sport: '', category: '' });
    setFilteredProducts(sampleProducts);
  };

  const addToCart = (product: Product, selectedSize: string) => {
    const existingItem = cart.find(item => 
      item.product.id === product.id && item.selectedSize === selectedSize
    );

    if (existingItem) {
      setCart(cart.map(item =>
        item.product.id === product.id && item.selectedSize === selectedSize
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1, selectedSize }]);
    }
  };

  const removeFromCart = (productId: number, selectedSize: string) => {
    setCart(cart.filter(item => 
      !(item.product.id === productId && item.selectedSize === selectedSize)
    ));
  };

  const updateCartQuantity = (productId: number, selectedSize: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize);
      return;
    }
    
    setCart(cart.map(item =>
      item.product.id === productId && item.selectedSize === selectedSize
        ? { ...item, quantity }
        : item
    ));
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimatedElements(prev => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Zap" size={32} className="text-sport-orange" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-sport-orange to-sport-blue bg-clip-text text-transparent">
                SportFamily
              </h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-sport-orange transition-colors">Главная</a>
              <a href="#catalog" className="text-gray-700 hover:text-sport-orange transition-colors">Каталог</a>
              <a href="#" className="text-gray-700 hover:text-sport-orange transition-colors">О нас</a>
              <a href="#" className="text-gray-700 hover:text-sport-orange transition-colors">Доставка</a>
              <a href="#" className="text-gray-700 hover:text-sport-orange transition-colors">Контакты</a>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Icon name="Search" size={20} />
              </Button>
              <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Icon name="ShoppingCart" size={20} />
                    {getTotalItems() > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-sport-orange text-white text-xs">
                        {getTotalItems()}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-lg">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <Icon name="ShoppingCart" size={24} />
                      Корзина ({getTotalItems()})
                    </SheetTitle>
                  </SheetHeader>
                  
                  <div className="flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto py-4">
                      {cart.length === 0 ? (
                        <div className="text-center py-8">
                          <Icon name="ShoppingCart" size={48} className="mx-auto text-gray-400 mb-4" />
                          <p className="text-gray-500">Корзина пуста</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {cart.map(item => (
                            <div key={`${item.product.id}-${item.selectedSize}`} className="flex items-center gap-3 p-3 border rounded-lg">
                              <img 
                                src={item.product.image} 
                                alt={item.product.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium text-sm line-clamp-2">{item.product.name}</h4>
                                <p className="text-xs text-gray-500">Размер: {item.selectedSize}</p>
                                <p className="font-bold text-sport-orange">{item.product.price.toLocaleString()} ₽</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                                >
                                  <Icon name="Minus" size={12} />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                                >
                                  <Icon name="Plus" size={12} />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                                >
                                  <Icon name="Trash2" size={12} className="text-red-500" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {cart.length > 0 && (
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-lg font-semibold">Итого:</span>
                          <span className="text-xl font-bold text-sport-orange">
                            {getTotalPrice().toLocaleString()} ₽
                          </span>
                        </div>
                        <Button className="w-full bg-sport-orange hover:bg-sport-orange/90 text-white">
                          Оформить заказ
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/img/6100cb68-3f33-4961-9782-0c37d2914133.jpg" 
            alt="Sports Hero" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sport-orange/30 to-sport-blue/30"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Спорт для <span className="bg-gradient-to-r from-sport-orange to-sport-blue bg-clip-text text-transparent">всей семьи</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Качественные спортивные товары для детей и взрослых. 
              Найдите идеальную экипировку для любого вида спорта!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-sport-orange hover:bg-sport-orange/90 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Icon name="ShoppingBag" size={20} className="mr-2" />
                Каталог товаров
              </Button>
              <Button size="lg" variant="outline" className="border-sport-blue text-sport-blue hover:bg-sport-blue hover:text-white px-8 py-4 text-lg rounded-full">
                <Icon name="Play" size={20} className="mr-2" />
                Смотреть видео
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Family Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 
            id="categories-title"
            data-animate
            className={`text-3xl font-bold text-center mb-12 transition-all duration-700 ${
              animatedElements.has('categories-title') 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-8 opacity-0'
            }`}
          >
            Спорт для каждого
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card 
              id="category-kids"
              data-animate
              className={`group hover:shadow-lg transition-all duration-500 hover:-translate-y-2 ${
                animatedElements.has('category-kids') 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: '100ms' }}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-sport-orange to-sport-yellow rounded-full flex items-center justify-center">
                  <Icon name="Baby" size={32} className="text-white" />
                </div>
                <CardTitle className="text-xl">Детям</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">Безопасная и качественная экипировка для юных спортсменов</p>
              </CardContent>
            </Card>

            <Card 
              id="category-adults"
              data-animate
              className={`group hover:shadow-lg transition-all duration-500 hover:-translate-y-2 ${
                animatedElements.has('category-adults') 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-sport-blue to-energy-purple rounded-full flex items-center justify-center">
                  <Icon name="Users" size={32} className="text-white" />
                </div>
                <CardTitle className="text-xl">Взрослым</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">Профессиональное снаряжение для серьезных тренировок</p>
              </CardContent>
            </Card>

            <Card 
              id="category-family"
              data-animate
              className={`group hover:shadow-lg transition-all duration-500 hover:-translate-y-2 ${
                animatedElements.has('category-family') 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-sport-yellow to-sport-orange rounded-full flex items-center justify-center">
                  <Icon name="Heart" size={32} className="text-white" />
                </div>
                <CardTitle className="text-xl">Всей семье</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">Активности и товары для совместного семейного отдыха</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="catalog" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Каталог товаров</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Широкий выбор спортивных товаров с возможностью фильтрации по возрасту, полу, виду спорта и размерам
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Возраст</label>
                <Select value={filters.age} onValueChange={(value) => handleFilterChange('age', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите возраст" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Дети">Дети</SelectItem>
                    <SelectItem value="Взрослые">Взрослые</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Пол</label>
                <Select value={filters.gender} onValueChange={(value) => handleFilterChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите пол" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Мужской">Мужской</SelectItem>
                    <SelectItem value="Женский">Женский</SelectItem>
                    <SelectItem value="Унисекс">Унисекс</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Вид спорта</label>
                <Select value={filters.sport} onValueChange={(value) => handleFilterChange('sport', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите спорт" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Бег">Бег</SelectItem>
                    <SelectItem value="Баскетбол">Баскетбол</SelectItem>
                    <SelectItem value="Фитнес">Фитнес</SelectItem>
                    <SelectItem value="Плавание">Плавание</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Категория</label>
                <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Обувь">Обувь</SelectItem>
                    <SelectItem value="Одежда">Одежда</SelectItem>
                    <SelectItem value="Мячи">Мячи</SelectItem>
                    <SelectItem value="Тренажеры">Тренажеры</SelectItem>
                    <SelectItem value="Аксессуары">Аксессуары</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" onClick={clearFilters} className="px-6">
                <Icon name="X" size={16} className="mr-2" />
                Сбросить
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <Card 
                key={product.id} 
                id={`product-${product.id}`}
                data-animate
                className={`group hover:shadow-lg transition-all duration-300 overflow-hidden transform ${
                  animatedElements.has(`product-${product.id}`) 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-8 opacity-0'
                }`}
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                  animationDelay: `${index * 100}ms`
                }}
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="cursor-pointer">
                      <div className="relative">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.isNew && (
                          <Badge className="absolute top-2 left-2 bg-sport-yellow text-black">Новинка</Badge>
                        )}
                        {product.discount && (
                          <Badge className="absolute top-2 right-2 bg-sport-orange text-white">-{product.discount}%</Badge>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                          <Icon name="Eye" size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>
                      
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-sport-orange transition-colors">
                          {product.name}
                        </CardTitle>
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                          <Badge variant="secondary" className="text-xs">{product.sport}</Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pb-2">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl font-bold text-sport-orange">{product.price.toLocaleString()} ₽</span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">{product.originalPrice.toLocaleString()} ₽</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          Размеры: {product.sizes.slice(0, 3).join(', ')}
                          {product.sizes.length > 3 && '...'}
                        </p>
                      </CardContent>
                    </div>
                  </DialogTrigger>
                  
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">{product.name}</DialogTitle>
                    </DialogHeader>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="relative">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full rounded-lg"
                        />
                        {product.isNew && (
                          <Badge className="absolute top-2 left-2 bg-sport-yellow text-black">Новинка</Badge>
                        )}
                        {product.discount && (
                          <Badge className="absolute top-2 right-2 bg-sport-orange text-white">-{product.discount}%</Badge>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">{product.category}</Badge>
                          <Badge variant="secondary">{product.sport}</Badge>
                          <Badge variant="secondary">{product.age}</Badge>
                          <Badge variant="secondary">{product.gender}</Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl font-bold text-sport-orange">{product.price.toLocaleString()} ₽</span>
                            {product.originalPrice && (
                              <span className="text-lg text-gray-500 line-through">{product.originalPrice.toLocaleString()} ₽</span>
                            )}
                          </div>
                          {product.discount && (
                            <p className="text-sm text-green-600 font-medium">Экономия: {(product.originalPrice! - product.price).toLocaleString()} ₽</p>
                          )}
                        </div>
                        
                        <p className="text-gray-600 leading-relaxed">
                          {product.description}
                        </p>
                        
                        <div className="space-y-3">
                          <label className="text-sm font-medium">Выберите размер:</label>
                          <div className="flex flex-wrap gap-2">
                            {product.sizes.map(size => (
                              <Button
                                key={size}
                                variant="outline"
                                size="sm"
                                className="hover:bg-sport-orange hover:text-white hover:border-sport-orange"
                                onClick={() => {
                                  addToCart(product, size);
                                  setIsCartOpen(true);
                                }}
                              >
                                {size}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <CardFooter className="pt-2">
                  <Button 
                    className="w-full bg-sport-blue hover:bg-sport-blue/90 text-white"
                    onClick={() => {
                      addToCart(product, product.sizes[0]);
                      setIsCartOpen(true);
                    }}
                  >
                    <Icon name="ShoppingCart" size={16} className="mr-2" />
                    В корзину
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Icon name="Package" size={48} className="mx-auto text-gray-400 mb-4" />
              <h4 className="text-xl font-semibold text-gray-600 mb-2">Товары не найдены</h4>
              <p className="text-gray-500">Попробуйте изменить параметры фильтрации</p>
            </div>
          )}
        </div>
      </section>

      {/* Family Sports Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">Спорт объединяет семью</h3>
              <p className="text-lg text-gray-600 mb-6">
                Совместные тренировки и активности — лучший способ провести время с семьей. 
                Мы поможем подобрать экипировку для каждого члена семьи.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Icon name="Check" size={20} className="text-sport-orange" />
                  <span>Товары для всех возрастов</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="Check" size={20} className="text-sport-orange" />
                  <span>Профессиональные консультации</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="Check" size={20} className="text-sport-orange" />
                  <span>Быстрая доставка по всей России</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="Check" size={20} className="text-sport-orange" />
                  <span>Гарантия качества</span>
                </div>
              </div>
              <Button className="mt-8 bg-sport-orange hover:bg-sport-orange/90 text-white px-8 py-3">
                Узнать больше
              </Button>
            </div>
            <div className="relative">
              <img 
                src="/img/7bf058bd-4d26-4683-9d4a-260e2624ccab.jpg" 
                alt="Family Sports" 
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Icon name="Zap" size={24} className="text-sport-orange" />
                <h4 className="text-xl font-bold">SportFamily</h4>
              </div>
              <p className="text-gray-400">
                Качественные спортивные товары для всей семьи
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Каталог</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-sport-orange transition-colors">Детские товары</a></li>
                <li><a href="#" className="hover:text-sport-orange transition-colors">Взрослые товары</a></li>
                <li><a href="#" className="hover:text-sport-orange transition-colors">Семейные активности</a></li>
                <li><a href="#" className="hover:text-sport-orange transition-colors">Новинки</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Информация</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-sport-orange transition-colors">О нас</a></li>
                <li><a href="#" className="hover:text-sport-orange transition-colors">Доставка</a></li>
                <li><a href="#" className="hover:text-sport-orange transition-colors">Оплата</a></li>
                <li><a href="#" className="hover:text-sport-orange transition-colors">Возврат</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Контакты</h5>
              <div className="space-y-2 text-gray-400">
                <p className="flex items-center gap-2">
                  <Icon name="Phone" size={16} />
                  +7 (800) 123-45-67
                </p>
                <p className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  info@sportfamily.ru
                </p>
                <p className="flex items-center gap-2">
                  <Icon name="MapPin" size={16} />
                  Москва, ул. Спортивная, 1
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SportFamily. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}