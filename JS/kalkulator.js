/* --- KALKULATOR 1 --- */

document.getElementById("deg-process-btn").addEventListener("click", processDegreeGraph);

function processDegreeGraph() {
  const text = document.getElementById("deg-edges-input").value.trim();
  const lines = text.split(/\n+/);

  const edges = [];
  const nodes = new Set();

  lines.forEach(line => {
    const parts = line.split("-").map(x => x.trim());
    if (parts.length === 2 && parts[0] && parts[1]) {
      edges.push(parts);
      nodes.add(parts[0]);
      nodes.add(parts[1]);
    }
  });

  const nodeArray = Array.from(nodes);

  if (nodeArray.length === 0) {
    document.getElementById("deg-result").textContent = "Input kosong atau tidak valid.";
    return;
  }

  // Hitung derajat
  const degree = {};
  nodeArray.forEach(n => degree[n] = 0);
  edges.forEach(([a, b]) => {
    degree[a]++;
    degree[b]++;
  });

  // LEMMA JABAT TANGAN
  let jumlahDerajat = 0;
  nodeArray.forEach(n => {
    jumlahDerajat += degree[n];  // jumlahkan derajat semua simpul
  });

  let jumlahGaris = edges.length;   // hitung garis
  let duaKaliGaris = jumlahGaris * 2;

  // Output
  let output = "Derajat tiap simpul:\n";
  nodeArray.forEach(n => output += `${n}: ${degree[n]}\n`);

  output += "\n=== Lemma Jabat Tangan ===\n";
  output += `Jumlah seluruh derajat simpul = ${jumlahDerajat}\n`;
  output += `Jumlah garis = ${jumlahGaris}\n`;
  output += `2 × jumlah garis = ${duaKaliGaris}\n`;

  if (jumlahDerajat === duaKaliGaris) {
    output += "✔ Sesuai Lemma Jabat Tangan";
  } else {
    output += "✘ Tidak sesuai (cek input graf)";
  }

  document.getElementById("deg-result").textContent = output;

  drawDegreeCanvas(nodeArray, edges);
}

function drawDegreeCanvas(nodes, edges) {
  const canvas = document.getElementById("deg-canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const positions = {};
  const R = Math.min(canvas.width, canvas.height) / 2.2;
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  nodes.forEach((n, i) => {
    const angle = (2 * Math.PI / nodes.length) * i;
    positions[n] = {
      x: cx + R * Math.cos(angle),
      y: cy + R * Math.sin(angle)
    };
  });

  ctx.lineWidth = 2;
  edges.forEach(([a, b]) => {
    const p1 = positions[a];
    const p2 = positions[b];
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  });

  nodes.forEach(n => {
    const p = positions[n];
    ctx.beginPath();
    ctx.arc(p.x, p.y, 18, 0, Math.PI * 2);
    ctx.fillStyle = "#0066cc";
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#fff";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(n, p.x, p.y);
  });
}

/* --- KALKULATOR 2 — VIS.JS (TIDAK DIUBAH) --- */

let visNetwork;
let visNodes = new vis.DataSet([]);
let visEdges = new vis.DataSet([]);

document.getElementById("vis-draw-btn").addEventListener("click", drawVisGraph);
document.getElementById("vis-path-btn").addEventListener("click", findVisPath);
document.getElementById("vis-con-btn").addEventListener("click", checkVisConnectivity);

function drawVisGraph() {
  const input = document.getElementById("vis-input").value;
  const edgeList = input.split(",");

  visNodes.clear();
  visEdges.clear();

  const nodeSet = new Set();

  edgeList.forEach(edge => {
    const [from, to] = edge.trim().split("-");
    if (!from || !to) return;
    nodeSet.add(from);
    nodeSet.add(to);

    visEdges.add({ id: from + "-" + to, from, to });
  });

  nodeSet.forEach(node => {
    visNodes.add({ id: node, label: node });
  });

  const container = document.getElementById("vis-container");
  const data = { nodes: visNodes, edges: visEdges };

  visNetwork = new vis.Network(container, data, {});
}

function findVisPath() {
  if (!visNetwork) return alert("Gambar graf dulu!");

  document.getElementById("vis-result").textContent =
    "Path dari A ke D: A-B-C-D (jika ada)";

  ["A-B", "B-C", "C-D"].forEach(id => {
    if (visEdges.get(id)) {
      visEdges.update({ id, color: "red", width: 4 });
    }
  });
}

function checkVisConnectivity() {
  if (!visNetwork) return alert("Gambar graf dulu!");

  document.getElementById("vis-result").textContent =
    "Graf terhubung: Ya (simulasi)";

  visNodes.forEach(node => {
    visNodes.update({ id: node.id, color: { background: "green" } });
  });
}
