/**
 * Hexo Solitude Theme - 鼠标拖动效果
 * 实现页面元素的拖动交互效果
 */

(function() {
    'use strict';

    // 配置选项
    const config = {
        // 拖动灵敏度
        sensitivity: window.hexo_config?.drag_effects?.sensitivity || 1.5,
        // 动画持续时间
        animationDuration: window.hexo_config?.drag_effects?.animation_duration || 300,
        // 是否启用拖动效果
        enabled: window.hexo_config?.drag_effects?.enable !== false,
        // 拖动元素选择器
        draggableSelectors: window.hexo_config?.drag_effects?.draggable_elements || [
            '.card-widget',
            '.post-item',
            '.sidebar-item',
            '.header',
            '.footer'
        ],
        // 视差效果配置
        parallax: {
            enabled: window.hexo_config?.drag_effects?.parallax?.enable !== false,
            speed: window.hexo_config?.drag_effects?.parallax?.speed || 0.5
        },
        // 悬停效果配置
        hoverEffects: {
            enabled: window.hexo_config?.drag_effects?.hover_effects?.enable !== false,
            scale: window.hexo_config?.drag_effects?.hover_effects?.scale || 1.05,
            translateY: window.hexo_config?.drag_effects?.hover_effects?.translate_y || -5
        }
    };

    // 拖动状态
    let dragState = {
        isDragging: false,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        element: null,
        originalTransform: ''
    };

    /**
     * 初始化拖动效果
     */
    function initDragEffects() {
        if (!config.enabled) return;

        // 为所有可拖动元素添加事件监听
        config.draggableSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                addDragListeners(element);
            });
        });

        console.log('拖动效果初始化完成');
    }

    /**
     * 为元素添加拖动监听器
     */
    function addDragListeners(element) {
        // 鼠标按下事件
        element.addEventListener('mousedown', handleMouseDown);
        
        // 鼠标移动事件
        document.addEventListener('mousemove', handleMouseMove);
        
        // 鼠标释放事件
        document.addEventListener('mouseup', handleMouseUp);
        
        // 鼠标离开事件
        element.addEventListener('mouseleave', handleMouseLeave);
        
        // 添加CSS类
        element.classList.add('draggable-element');
    }

    /**
     * 处理鼠标按下事件
     */
    function handleMouseDown(e) {
        if (e.button !== 0) return; // 只响应左键

        dragState.isDragging = true;
        dragState.element = e.currentTarget;
        dragState.startX = e.clientX;
        dragState.startY = e.clientY;
        dragState.currentX = 0;
        dragState.currentY = 0;
        dragState.originalTransform = dragState.element.style.transform || '';

        // 添加拖动状态类
        dragState.element.classList.add('dragging');
        
        // 阻止默认行为
        e.preventDefault();
    }

    /**
     * 处理鼠标移动事件
     */
    function handleMouseMove(e) {
        if (!dragState.isDragging || !dragState.element) return;

        // 计算移动距离
        const deltaX = (e.clientX - dragState.startX) * config.sensitivity;
        const deltaY = (e.clientY - dragState.startY) * config.sensitivity;

        // 应用变换
        applyTransform(deltaX, deltaY);
    }

    /**
     * 处理鼠标释放事件
     */
    function handleMouseUp(e) {
        if (!dragState.isDragging) return;

        // 移除拖动状态
        dragState.element.classList.remove('dragging');
        
        // 平滑回到原位置
        animateToOriginalPosition();
        
        // 重置状态
        resetDragState();
    }

    /**
     * 处理鼠标离开事件
     */
    function handleMouseLeave(e) {
        if (dragState.isDragging) {
            handleMouseUp(e);
        }
    }

    /**
     * 应用变换
     */
    function applyTransform(x, y) {
        if (!dragState.element) return;

        // 限制拖动范围
        const maxOffset = 50;
        const limitedX = Math.max(-maxOffset, Math.min(maxOffset, x));
        const limitedY = Math.max(-maxOffset, Math.min(maxOffset, y));

        // 应用变换
        dragState.element.style.transform = `translate(${limitedX}px, ${limitedY}px) rotate(${limitedX * 0.1}deg)`;
        
        // 更新当前位置
        dragState.currentX = limitedX;
        dragState.currentY = limitedY;
    }

    /**
     * 动画回到原位置
     */
    function animateToOriginalPosition() {
        if (!dragState.element) return;

        // 添加过渡动画
        dragState.element.style.transition = `transform ${config.animationDuration}ms ease-out`;
        
        // 回到原位置
        dragState.element.style.transform = dragState.originalTransform;
        
        // 动画完成后移除过渡
        setTimeout(() => {
            if (dragState.element) {
                dragState.element.style.transition = '';
            }
        }, config.animationDuration);
    }

    /**
     * 重置拖动状态
     */
    function resetDragState() {
        dragState.isDragging = false;
        dragState.element = null;
        dragState.startX = 0;
        dragState.startY = 0;
        dragState.currentX = 0;
        dragState.currentY = 0;
        dragState.originalTransform = '';
    }

    /**
     * 添加3D视差效果
     */
    function addParallaxEffect() {
        if (!config.parallax.enabled) return;
        
        document.addEventListener('mousemove', (e) => {
            if (dragState.isDragging) return;

            const elements = document.querySelectorAll('.parallax-element');
            elements.forEach(element => {
                const speed = element.dataset.speed || config.parallax.speed;
                const x = (window.innerWidth - e.clientX * speed) / 100;
                const y = (window.innerHeight - e.clientY * speed) / 100;
                
                element.style.transform = `translateX(${x}px) translateY(${y}px)`;
            });
        });
    }

    /**
     * 添加悬停效果
     */
    function addHoverEffects() {
        if (!config.hoverEffects.enabled) return;
        
        const hoverElements = document.querySelectorAll('.hover-effect');
        
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transform = `scale(${config.hoverEffects.scale}) translateY(${config.hoverEffects.translateY}px)`;
                element.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'scale(1) translateY(0)';
                element.style.boxShadow = '';
            });
        });
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDragEffects);
    } else {
        initDragEffects();
    }

    // 添加视差效果
    addParallaxEffect();
    
    // 添加悬停效果
    addHoverEffects();

    // 导出配置，允许外部修改
    window.DragEffects = {
        config: config,
        init: initDragEffects,
        addParallaxEffect: addParallaxEffect,
        addHoverEffects: addHoverEffects
    };

})(); 