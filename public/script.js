(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? '×' : '☰';
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = '☰';
    }));
  }
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const messagesEl = document.getElementById('chat-messages');
  const statusEl = document.getElementById('chat-status');
  const sendButton = document.getElementById('chat-send');
  const resetButton = document.getElementById('chat-reset');
  if (!form || !input || !messagesEl) return;

  // Deliberately memory-only: no localStorage, cookies, or saved transcript.
  let conversation = [];
  let busy = false;

  function addMessage(role, text, sources = []) {
    const wrap = document.createElement('div');
    wrap.className = `chat-message ${role === 'user' ? 'user-message' : 'assistant-message'}`;
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    wrap.appendChild(paragraph);
    if (role === 'assistant' && sources.length) {
      const sourceWrap = document.createElement('div');
      sourceWrap.className = 'chat-sources';
      sources.forEach(source => {
        if (!source || typeof source.title !== 'string' || typeof source.href !== 'string') return;
        // Only allow same-site relative links or same-origin absolute links.
        let href = '';
        try {
          const parsed = new URL(source.href, window.location.origin);
          if (parsed.origin === window.location.origin && parsed.pathname.startsWith('/')) href = parsed.href;
        } catch (_) {}
        if (!href) return;
        const link = document.createElement('a');
        link.className = 'chat-source';
        link.href = href;
        link.textContent = `Explore: ${source.title}`;
        sourceWrap.appendChild(link);
      });
      if (sourceWrap.childNodes.length) wrap.appendChild(sourceWrap);
    }
    messagesEl.appendChild(wrap);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function setStatus(text, isError = false) {
    statusEl.textContent = text;
    statusEl.classList.toggle('error', isError);
  }

  async function sendMessage(rawText) {
    const text = rawText.trim();
    if (!text || busy) return;
    busy = true;
    input.value = '';
    input.disabled = true;
    sendButton.disabled = true;
    addMessage('user', text);
    conversation.push({ role: 'user', content: text });
    setStatus('Thinking…');
    const typing = document.createElement('div');
    typing.className = 'chat-message assistant-message chat-typing';
    typing.textContent = 'Ask Hudi is thinking…';
    messagesEl.appendChild(typing);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversation.slice(-12),
          pageContext: { path: window.location.pathname, section: 'ask-hudi' }
        })
      });
      const data = await response.json().catch(() => ({}));
      typing.remove();
      if (!response.ok) {
        const message = data?.error?.message || 'Ask Hudi is temporarily unavailable. Please try again.';
        throw new Error(message);
      }
      const answer = typeof data.answer === 'string' && data.answer.trim() ? data.answer.trim() : 'I could not form a useful answer just now. Please try another question.';
      conversation.push({ role: 'assistant', content: answer });
      conversation = conversation.slice(-12);
      addMessage('assistant', answer, Array.isArray(data.sources) ? data.sources : []);
      setStatus('This conversation exists only in this page session. It is not saved by this website.');
    } catch (error) {
      typing.remove();
      // Keep the user's question in the conversation so they can retry without losing context.
      setStatus(error.message || 'Connection problem. Please try again.', true);
      const retry = document.createElement('div');
      retry.className = 'chat-message assistant-message';
      retry.textContent = 'I could not complete that request. Your question is still available above—please try again shortly.';
      messagesEl.appendChild(retry);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    } finally {
      busy = false;
      input.disabled = false;
      sendButton.disabled = false;
      input.focus();
    }
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    sendMessage(input.value);
  });
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });
  document.querySelectorAll('[data-ask]').forEach(button => {
    button.addEventListener('click', () => sendMessage(button.getAttribute('data-ask') || ''));
  });
  resetButton?.addEventListener('click', () => {
    if (busy) return;
    conversation = [];
    messagesEl.replaceChildren();
    addMessage('assistant', 'New conversation started. Ask me about professional experience, projects, or an engineering challenge.');
    setStatus('Your conversation stays in this page session and is not saved by this website.');
    input.value = '';
    input.focus();
  });
})();
