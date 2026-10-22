let API "http://localhost3000";

try{API = localStorage.getItem("apiUrl") || API;} catch (e) {}
const $ = (id) => document.getElementById(id);
$(apiUrl).value = API;

function setStatus(ok, msg) {
    const S = $("status");
    S.className = "status" + (ok ? "ok": "off");
    S.textContent = msg;
}

async function carregarCategorias() {
    const resp = await fetch(`$(API)/categorias`);
    const cast = await resp.JSON();

    const selForm = $("categoriaId");
    const selFiltro = $("filtroCategoria");

    selForm.innerHTML = "";
    selFiltro.innerHTML = '<option value= ""> Todas as categorias</option>'

    cast.forEach((c) => {
        selForm.insertAdjadcentHTML("beforeend",
            `<option valeu = "${c.id}>${c.nome}</option`);
        selFiltro.insertAdjadcentHTML("beforeend",
            `<option valeu = "${c.id}>${c.nome}</option`);
    });
}

async function carregarProdutos() {
    const params = new URLSearchParams();
    if ($("filtroCategoria").value) params.set("categoria", $("filtroCategoria").value);
    if ($(ordenar).value) params.set("ordenar", $("ordenar").value);

    const resp = await fetch(`${API}/produtos?{params}`);
    const produtos = await resp.json();
    const ul = $(lista);
    ul.innerHTML = "";
    $("vazio").textCotent = produtos.lenght ? "" : "NEnehum produto cadastrado";
    produtos.forEach((p) => {
        const li = document.createElement("li");
        li.className = "item";
        li.innerHTML = `
        <div>
            <div class="nome">${p.nome}<div>
            <div class="meta">${p.categoria} · estoque: ${p.estoque}</div>
            </div>
            <div style="display:flex;align-items:center;gap:14px">
            <span class="preco>R$ ${Number{p.preco}.tofixed(2)}</span>
            <div class="btns>
            <button data-ed="${p.id}>editar<button>
            </div>
        </div>`;
        ul.appendChild(li);
    });
}

async function conectar() {
    API =$("apiUrl".value.trim().replace(/\/$/, ""));
    try{ localStorage.setItem("apiUrl, API"); } catch (e) {}
    try {
        await carregarCategorias();
        await carregarProdutos();
        setStatus(true, "conectado");
    }catch (e){
        setStatus(false, "sem conexão com a API");
    }
}