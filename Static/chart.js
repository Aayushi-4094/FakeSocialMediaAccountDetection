// Import fonts dynamically (optional, load in HTML for better performance)
document.fonts.load('16px Inter').then(() => console.log('Fonts loaded'));

// Global variables for animations and interactions
let threatSimulation, botnetSimulation;

// Threat Map (D3.js with interactive tooltips)
function initThreatMap() {
    const svg = d3.select("#threat-map-svg");
    const width = svg.node().getBoundingClientRect().width;
    const height = 400;

    // Simulated data: Random points with tooltips
    const data = Array.from({ length: 50 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        id: `Threat_${Math.floor(Math.random() * 1000)}`,
    }));

    // Scales and forces
    const simulation = d3.forceSimulation(data)
        .force("charge", d3.forceManyBody().strength(-30))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(10));

    // Tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "rgba(0, 0, 0, 0.8)")
        .style("color", "#fff")
        .style("padding", "5px 10px")
        .style("border-radius", "4px")
        .style("display", "none");

    // Circles
    const circles = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("r", 8)
        .attr("fill", d => d3.interpolateReds(Math.random()))
        .attr("opacity", 0.7)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
        .on("mouseover", (event, d) => {
            tooltip.style("display", "block")
                .html(`Threat ID: ${d.id}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px");
        })
        .on("mouseout", () => tooltip.style("display", "none"));

    simulation.on("tick", () => {
        circles.attr("cx", d => d.x).attr("cy", d => d.y);
    });

    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}

// Botnet Evolution Simulation (D3.js with force-directed graph and animation)
function initBotnetSimulation() {
    const svg = d3.select("#botnet-simulation-svg");
    const width = svg.node().getBoundingClientRect().width;
    const height = 400;

    const nodes = Array.from({ length: 20 }, (_, i) => ({ id: i, group: Math.floor(Math.random() * 3) }));
    const links = [];
    for (let i = 0; i < nodes.length - 1; i++) {
        if (Math.random() > 0.3) links.push({ source: i, target: i + 1 });
    }

    botnetSimulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(50))
        .force("charge", d3.forceManyBody().strength(-100))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(15));

    const link = svg.append("g")
        .selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("stroke", d => d3.schemeCategory10[d.source.group])
        .attr("stroke-width", 2)
        .attr("opacity", 0.6);

    const node = svg.append("g")
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("r", 12)
        .attr("fill", d => d3.schemeCategory10[d.group])
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    botnetSimulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    });

    function dragstarted(event, d) {
        if (!event.active) botnetSimulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) botnetSimulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    // Animate node growth/shrink
    d3.interval(() => {
        node.transition()
            .duration(1000)
            .attr("r", d => 12 + Math.sin(Date.now() / 1000 + d.id) * 5);
    }, 2000);
}

// Influence Analytics Chart (D3.js with smooth curves, tooltips, and interactivity)
function initInfluenceChart(confidence) {
    const svg = d3.select("#influence-chart");
    const width = svg.node().getBoundingClientRect().width;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };

    const data = Array.from({ length: 20 }, (_, i) => ({
        time: i,
        value: 50 + (Math.sin(i * 0.5) * 20) * (confidence / 100),
    }));

    const xScale = d3.scaleLinear().domain([0, data.length - 1]).range([margin.left, width - margin.right]);
    const yScale = d3.scaleLinear().domain([0, 100]).range([height - margin.bottom, margin.top]);

    // Tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "rgba(0, 0, 0, 0.8)")
        .style("color", "#fff")
        .style("padding", "8px 12px")
        .style("border-radius", "6px")
        .style("display", "none")
        .style("pointer-events", "none");

    // Line generator with smooth curve
    const line = d3.line()
        .x(d => xScale(d.time))
        .y(d => yScale(d.value))
        .curve(d3.curveCatmullRom.alpha(0.5));

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#00ffcc")
        .attr("stroke-width", 3)
        .attr("d", line)
        .attr("opacity", 0)
        .transition()
        .duration(1000)
        .attr("opacity", 1);

    // Axes
    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).ticks(5))
        .attr("color", "#aaa");

    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale).ticks(5))
        .attr("color", "#aaa");

    // Interactivity
    svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.time))
        .attr("cy", d => yScale(d.value))
        .attr("r", 5)
        .attr("fill", "#00ffcc")
        .attr("opacity", 0.7)
        .on("mouseover", (event, d) => {
            tooltip.style("display", "block")
                .html(`Time: ${d.time}<br>Credibility: ${d.value.toFixed(2)}%`)
                .style("left", (event.pageX + 15) + "px")
                .style("top", (event.pageY - 15) + "px");
        })
        .on("mouseout", () => tooltip.style("display", "none"));
}

// AR Visualization (Canvas with advanced 2D animation, WebXR-ready)
function initARVisualization() {
    const canvas = document.getElementById("ar-canvas");
    const ctx = canvas.getContext("2d");
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = 400;

    let angle = 0;
    let scale = 1;

    function animate() {
        ctx.clearRect(0, 0, width, height);
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.scale(scale, scale);
        ctx.rotate(angle);

        // Draw a pulsing, glowing polygon (diamond-like)
        ctx.beginPath();
        ctx.moveTo(0, -60);
        ctx.lineTo(60, 0);
        ctx.lineTo(0, 60);
        ctx.lineTo(-60, 0);
        ctx.closePath();
        ctx.fillStyle = `rgba(0, 255, 0, ${0.7 + Math.sin(Date.now() / 500) * 0.3})`;
        ctx.shadowBlur = 20;
        ctx.shadowColor = "rgba(0, 255, 0, 0.8)";
        ctx.fill();

        ctx.restore();

        // Pulsing effect
        scale = 1 + Math.sin(Date.now() / 1000) * 0.1;
        angle += 0.03;

        requestAnimationFrame(animate);
    }
    animate();

    // Add interactivity (hover effect)
    canvas.addEventListener("mousemove", (event) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const centerX = width / 2;
        const centerY = height / 2;

        const distance = Math.hypot(mouseX - centerX, mouseY - centerY);
        scale = 1 + (distance / 200) * 0.1; // Scale based on mouse distance
    });
}

// Theme Toggle Logic with Animation
function toggleTheme() {
    const body = document.body;
    const themes = ["dark-mode", "cyberpunk", "matrix", "hacker"];
    const currentTheme = themes.find(theme => body.classList.contains(theme));
    const nextTheme = themes[(themes.indexOf(currentTheme) + 1) % themes.length];

    body.classList.remove(...themes);
    body.classList.add(nextTheme);

    // Smooth transition for visualizations
    if (threatSimulation) threatSimulation.alpha(0.3).restart();
    if (botnetSimulation) botnetSimulation.alpha(0.3).restart();
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initThreatMap();
    initBotnetSimulation();
    document.getElementById('toggle-theme').addEventListener('click', toggleTheme);
});

// Tooltip Styling (Global)
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .tooltip {
            font-size: 0.9em;
            z-index: 1000;
            transition: opacity 0.2s;
        }
    </style>
`);