function component() {
  const element = document.createElement('div');

  element.innerHTML = 'Hello webpack!' ?? 'Hello world!';

  return element;
}

document.body.appendChild(component());
