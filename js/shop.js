const products = {
  fruit: {
    id: 'fruit',
    name: 'FRUIT TINT',
    subtitle: '생기 있는 컬러감으로 완성하는 데일리 립',
    price: 18000,
    image: './images/product1.png',
    detailImage: './images/product1.png',
    detailPage: './images/detail-fruit-tint.png',
    colors: ['01 PINK GUAVA', '02 CHERRY RED', '03 FIG ROSE'],
    detailTitle: 'FRESH COLOR<br />SOFT FINISH'
  },
  eye: {
    id: 'eye',
    name: 'EYE PALETTE',
    subtitle: '누구나 쉽게 완성하는 데일리 음영 메이크업',
    price: 22000,
    image: './images/product2.png',
    detailImage: './images/eye_makeup.png',
    detailPage: './images/detail-eye-palette.png',
    colors: ['01 DAILY BEIGE', '02 ROSY BROWN', '03 COOL MAUVE'],
    detailTitle: 'EASY BLENDING<br />DAILY SHADES'
  },
  blusher: {
    id: 'blusher',
    name: 'BLUSHER',
    subtitle: '맑고 자연스럽게 물드는 내추럴 치크 컬러',
    price: 19000,
    image: './images/product3.png',
    detailImage: './images/product3.png',
    detailPage: './images/detail-cheek-blusher.png',
    colors: ['01 PEACH', '02 PINK', '03 MAUVE'],
    detailTitle: 'CLEAR COLOR<br />SOFT CHEEK'
  }
};

const formatWon = value => `₩${Number(value).toLocaleString('ko-KR')}`;

function getCart() {
  try {
    return JSON.parse(localStorage.getItem('brand16Cart')) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('brand16Cart', JSON.stringify(cart));
}

const loginForm = document.querySelector('#loginForm');
loginForm?.addEventListener('submit', event => {
  event.preventDefault();
  const email = document.querySelector('#loginEmail');
  const password = document.querySelector('#loginPassword');
  const message = document.querySelector('#loginMessage');
  if (!email.value.trim() || !password.value.trim()) {
    message.textContent = '이메일과 비밀번호를 모두 입력해주세요.';
    return;
  }
  message.textContent = '로그인되었습니다. 포트폴리오 데모 화면입니다.';
  setTimeout(() => { window.location.href = './index.html'; }, 800);
});

const joinForm = document.querySelector('#joinForm');
const allTerms = document.querySelector('#allTerms');
allTerms?.addEventListener('change', () => {
  document.querySelectorAll('.terms-list input').forEach(input => {
    input.checked = allTerms.checked;
  });
});

joinForm?.addEventListener('submit', event => {
  event.preventDefault();
  const password = document.querySelector('#joinPassword');
  const confirm = document.querySelector('#joinPasswordConfirm');
  const requiredTerms = [...document.querySelectorAll('.required-term')];
  const message = document.querySelector('#joinMessage');
  const requiredFields = [...joinForm.querySelectorAll('input[required]')];
  if (requiredFields.some(field => !field.value.trim())) {
    message.textContent = '필수 입력 항목을 모두 작성해주세요.';
    return;
  }
  if (password.value.length < 8) {
    message.textContent = '비밀번호는 8자 이상 입력해주세요.';
    return;
  }
  if (password.value !== confirm.value) {
    message.textContent = '비밀번호가 서로 일치하지 않습니다.';
    return;
  }
  if (requiredTerms.some(term => !term.checked)) {
    message.textContent = '필수 약관에 동의해주세요.';
    return;
  }
  message.textContent = '회원가입이 완료되었습니다. 로그인 화면으로 이동합니다.';
  setTimeout(() => { window.location.href = './login.html'; }, 900);
});

const productImage = document.querySelector('#productImage');
if (productImage) {
  const params = new URLSearchParams(window.location.search);
  const product = products[params.get('id')] || products.fruit;
  let quantity = 1;
  let selectedColor = product.colors[0];

  document.title = `${product.name} | 16BRAND`;
  document.querySelector('#breadcrumbName').textContent = product.name;
  document.querySelector('#productName').textContent = product.name;
  document.querySelector('#productSubtitle').textContent = product.subtitle;
  document.querySelector('#productPrice').textContent = formatWon(product.price);
  document.querySelector('#productImage').src = product.image;
  document.querySelector('#productImage').alt = product.name;
  document.querySelector('#detailImage').src = product.detailImage;
  document.querySelector('#detailTitle').innerHTML = product.detailTitle;
  document.querySelector('#productDetailPage').src = product.detailPage;
  document.querySelector('#productDetailPage').alt = `${product.name} 상품 상세페이지`;

  const thumbs = document.querySelector('#productThumbs');
  [product.image, product.detailImage].forEach((src, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `product-thumb${index === 0 ? ' active' : ''}`;
    button.innerHTML = `<img src="${src}" alt="${product.name} 이미지 ${index + 1}">`;
    button.addEventListener('click', () => {
      document.querySelectorAll('.product-thumb').forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      productImage.src = src;
    });
    thumbs.appendChild(button);
  });

  const colorOptions = document.querySelector('#colorOptions');
  product.colors.forEach((color, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `color-chip${index === 0 ? ' active' : ''}`;
    button.textContent = color;
    button.addEventListener('click', () => {
      document.querySelectorAll('.color-chip').forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      selectedColor = color;
      document.querySelector('#selectedColor').textContent = color;
    });
    colorOptions.appendChild(button);
  });

  const quantityOutput = document.querySelector('#quantity');
  document.querySelector('#qtyMinus').addEventListener('click', () => {
    quantity = Math.max(1, quantity - 1);
    quantityOutput.textContent = quantity;
  });
  document.querySelector('#qtyPlus').addEventListener('click', () => {
    quantity = Math.min(9, quantity + 1);
    quantityOutput.textContent = quantity;
  });

  const addToCart = redirect => {
    const cart = getCart();
    const existing = cart.find(item => item.id === product.id && item.color === selectedColor);
    if (existing) existing.quantity += quantity;
    else cart.push({ ...product, color: selectedColor, quantity });
    saveCart(cart);
    document.querySelector('#productMessage').textContent = '장바구니에 상품을 담았습니다.';
    if (redirect) setTimeout(() => { window.location.href = './cart.html'; }, 500);
  };

  document.querySelector('#addCart').addEventListener('click', () => addToCart(false));
  document.querySelector('#buyNow').addEventListener('click', () => addToCart(true));
}

const cartList = document.querySelector('#cartList');
if (cartList) {
  const cart = getCart();
  const summary = document.querySelector('#cartSummary');
  if (!cart.length) {
    cartList.innerHTML = '<div class="empty-cart"><h2>장바구니가 비어 있어요.</h2><p>16BRAND의 컬러를 둘러보세요.</p><a class="shop-primary" style="max-width:220px;margin:28px auto 0" href="./index.html#best">SHOP NOW</a></div>';
  } else {
    let total = 0;
    cart.forEach((item, index) => {
      total += item.price * item.quantity;
      const article = document.createElement('article');
      article.className = 'cart-item';
      article.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div>
          <h3>${item.name}</h3>
          <p>${item.color}</p>
          <p>수량 ${item.quantity}</p>
        </div>
        <div>
          <strong>${formatWon(item.price * item.quantity)}</strong><br>
          <button type="button" data-remove="${index}" style="margin-top:12px;background:none;color:#b6677e;font-size:12px">REMOVE</button>
        </div>`;
      cartList.appendChild(article);
    });
    summary.hidden = false;
    document.querySelector('#subtotal').textContent = formatWon(total);
    document.querySelector('#totalPrice').textContent = formatWon(total);
    document.querySelectorAll('[data-remove]').forEach(button => {
      button.addEventListener('click', () => {
        cart.splice(Number(button.dataset.remove), 1);
        saveCart(cart);
        window.location.reload();
      });
    });
    document.querySelector('#checkout').addEventListener('click', () => {
      alert('포트폴리오 데모로 실제 결제는 진행되지 않습니다.');
    });
  }
}
