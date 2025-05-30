// Dashboard.tsx
// Componente Dashboard que encapsula la lógica existente de la aplicación de comida rápida
// Компонент Dashboard который инкапсулирует существующую логику приложения быстрого питания

import { useEffect, lazy, Suspense, useContext } from 'react';
import FoodOrder from './FoodOrder';
import Cart from './Cart';
import OrdersManager from './OrdersManager';
import logger from '../services/logging';

// Importamos AuthContext para verificar roles
// Импортируем AuthContext для проверки ролей
import { AuthContext } from '../contexts/AuthContext';
import { Role } from '../services/IAuthService';

// Importamos los hooks y acciones de Redux
// Импортируем хуки и действия Redux
import { useAppDispatch, useAppSelector, useCartTotalItems, useUI } from '../store/hooks';
import { fetchMenu } from '../store/slices/menuSlice';
import { fetchOrders } from '../store/slices/ordersSlice';
import { 
  toggleChooseFoodPage, 
  toggleCart, 
  toggleOrdersManager,
  setSelectedFood 
} from '../store/slices/uiSlice';

// Carga diferida de componentes
// Ленивая загрузка компонентов
const Foods = lazy(() => import('./Foods'));

const Dashboard: React.FC = () => {
  // Redux hooks
  const dispatch = useAppDispatch();
  const menuItems = useAppSelector(state => state.menu.items);
  const cartTotalItems = useCartTotalItems();
  const uiState = useUI();
  const isLoading = useAppSelector(state => state.menu.loading);

  // Auth context para verificar roles
  // Auth context для проверки ролей
  const { user, roles } = useContext(AuthContext);

  // Verificar si el usuario es administrador
  // Проверить является ли пользователь администратором
  const isAdmin = roles && roles.includes(Role.ADMIN);

  // Inicialización del dashboard
  // Инициализация dashboard
  useEffect(() => {
    logger.info("🍽️ Dashboard iniciado - cargando menú");
    dispatch(fetchMenu());
  }, [dispatch]);

  // Manejadores de eventos
  // Обработчики событий
  const handleToggleFoodPage = () => {
    logger.debug('🔄 Alternando página de comida');
    dispatch(toggleChooseFoodPage());
  };

  const handleToggleCart = () => {
    logger.debug('🛒 Alternando carrito');
    dispatch(toggleCart());
  };

  const handleToggleOrdersManager = () => {
    // Solo permitir si es administrador
    // Разрешать только если это администратор
    if (!isAdmin) {
      logger.warn('❌ Acceso denegado: solo administradores pueden gestionar pedidos');
      alert('Solo los administradores pueden acceder a la gestión de pedidos');
      return;
    }

    logger.debug('📋 Alternando gestor de pedidos');
    dispatch(toggleOrdersManager());
    
    // Si abrimos el gestor de pedidos, cargamos los pedidos
    // Если открываем менеджер заказов, загружаем заказы
    if (!uiState.showOrdersManager) {
      dispatch(fetchOrders());
    }
  };

  const handleFoodSelected = (food: any) => {
    logger.debug(`🍽️ Comida seleccionada: ${food.name}`);
    dispatch(setSelectedFood(food));
  };

  const handleReturnToMenu = () => {
    logger.debug('🔙 Regresando al menú');
    dispatch(setSelectedFood(null));
  };

  return (
    <div className="app-container">
      {/* Botones de navegación principal */}
      {/* Кнопки основной навигации */}
      <div className="header-buttons">
        <button 
          className="toggleButton" 
          onClick={handleToggleFoodPage}
          disabled={isLoading}
        > 
          {uiState.isChooseFoodPage ? "Disponibilidad" : "Pedir Comida"} 
        </button>
        
        <button 
          className="cartButton" 
          onClick={handleToggleCart}
        >
          Carrito ({cartTotalItems})
        </button>
        
        {/* Solo mostrar botón de gestión para administradores */}
        {/* Показывать кнопку управления только для администраторов */}
        {isAdmin && (
          <button
            className="ordersButton"
            onClick={handleToggleOrdersManager}
            title="Solo disponible para administradores"
          >
            {uiState.showOrdersManager ? "Cerrar Pedidos" : "Gestionar Pedidos"}
          </button>
        )}
      </div>
      
      <h3 className="title">Comida Rápida Online</h3>
      
      {/* Mostrar información del usuario y rol */}
      {/* Показать информацию о пользователе и роли */}
      <div style={{ 
        marginBottom: '1rem', 
        padding: '0.5rem', 
        background: isAdmin ? '#d4edda' : '#e2e3e5',
        borderRadius: '5px',
        fontSize: '0.9rem'
      }}>
        👤 Usuario: <strong>{user?.email}</strong> | 
        🔑 Rol: <strong>{isAdmin ? 'Administrador' : 'Usuario'}</strong>
        {isAdmin && <span> | ⚙️ Tienes acceso completo al sistema</span>}
      </div>
      
      {/* Indicador de carga */}
      {/* Индикатор загрузки */}
      {isLoading && (
        <div className="loading-indicator">
          Cargando menú...
        </div>
      )}
      
      {/* Carrito de compras */}
      {/* Корзина покупок */}
      {uiState.showCart && <Cart />}
      
      {/* Gestor de pedidos o contenido principal */}
      {/* Менеджер заказов или основной контент */}
      {uiState.showOrdersManager ? (
        // Solo mostrar si es administrador
        // Показывать только если это администратор
        isAdmin ? (
          <OrdersManager />
        ) : (
          <div style={{ 
            padding: '2rem', 
            background: '#f8d7da', 
            borderRadius: '5px',
            color: '#721c24',
            textAlign: 'center'
          }}>
            <h4>❌ Acceso Denegado</h4>
            <p>Solo los administradores pueden acceder a la gestión de pedidos.</p>
          </div>
        )
      ) : (
        <>
          {/* Vista de disponibilidad (menú principal) */}
          {/* Вид доступности (главное меню) */}
          {!uiState.isChooseFoodPage && (       
            <>
              <h4 className="subTitle">Menús</h4> 
              <ul className="ulApp"> 
                {menuItems.map((item) => ( 
                  <li 
                    key={item.id} 
                    className="liApp" 
                    onClick={() => handleFoodSelected(item)}
                  > 
                    <p>{item.name}</p>
                    <p>#{item.quantity}</p> 
                  </li> 
                ))} 
              </ul>
            </>
          )} 
        
          {/* Vista de pedido de comida */}
          {/* Вид заказа еды */}
          {uiState.isChooseFoodPage && (
            uiState.selectedFood ? (
              <FoodOrder
                food={uiState.selectedFood}
                onReturnToMenu={handleReturnToMenu}
              />
            ) : (
              <Suspense fallback={<div>Cargando detalles…</div>}>
                <Foods onFoodSelected={handleFoodSelected} />
              </Suspense>
            )
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;