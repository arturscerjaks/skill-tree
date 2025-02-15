class HeaderNav extends HTMLElement {
  constructor() {
    super();
    
    this.innerHTML = `
      <nav class="bg-white py-4 shadow-md absolute top-0 left-0 z-10 w-full">
        <div class="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <a href="/" class="font-bold text-2xl text-gray-900">
            Skill Tree
          </a>
          
          <ul class="flex gap-8">
            <li><a href="./index.html" class="text-gray-600 hover:text-gray-900 transition-colors">Skill Trees</a></li>
            <li><a href="./create.html" class="text-gray-600 hover:text-gray-900 transition-colors">Create</a></li>
          </ul>
        </div>
      </nav>
    `;
  }
}

// Register the custom element
customElements.define('header-nav', HeaderNav); 