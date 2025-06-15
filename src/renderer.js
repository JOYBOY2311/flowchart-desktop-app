document.addEventListener('DOMContentLoaded', async () => {
    const mainView = document.getElementById('main-view');
    const subFlowView = document.getElementById('sub-flow-view');
    const mainFlowchartContainer = document.getElementById('main-flowchart-container');
    const subFlowTitle = document.getElementById('sub-flow-title');
    const subFlowBoxesContainer = document.getElementById('sub-flow-boxes-container');
    const backToMainBtn = document.getElementById('back-to-main');
    const addNewBoxBtn = document.getElementById('add-new-box-btn');
    const statusText = document.getElementById('status-text');
    const actionModal = document.getElementById('action-modal');
    const createSubflowBtn = document.getElementById('create-subflow-btn');
    const linkFolderBtn = document.getElementById('link-folder-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const unlinkFolderBtn = document.getElementById('unlink-folder-btn');
    const deleteSubflowBtn = document.getElementById('delete-subflow-btn');

    let projectData = {};
    let currentlySelectedBoxId = null;
    let currentSubFlowId = null;

    const defaultData = {"projectName":"The Complete SaaS Application Lifecycle","theme":"light","flows":{"main":[{"id":"phase-1","title":"Phase 1: Planning & Discovery","boxes":[{"id":"p1-b1","icon":"fa-search","title":"Idea Validation & Market Research","description":"Problem-Solution Fit, Competitor Analysis, Target Audience, SEO Strategy.","link":null,"color":"blue"},{"id":"p1-b2","icon":"fa-list-ol","title":"Feature Prioritization & MVP Scoping","description":"Core Functionality, MoSCoW Method, Minimum Viable Product (MVP).","link":null,"color":"blue"},{"id":"p1-b3","icon":"fa-dollar-sign","title":"Monetization Strategy","description":"Pricing Model, Billing Cycle, Payment Gateway Selection.","link":null,"color":"blue"},{"id":"p1-b4","icon":"fa-layer-group","title":"Technology Stack Selection","description":"Frontend, Backend, Database, and Infrastructure choices.","link":null,"color":"blue"}]},{"id":"phase-2","title":"Phase 2: Design & Prototyping","boxes":[{"id":"p2-b1","icon":"fa-sitemap","title":"User Experience (UX) Design","description":"User Flows and Wireframing to define structure and functionality.","link":null,"color":"teal"},{"id":"p2-b2","icon":"fa-paint-brush","title":"User Interface (UI) Design","description":"High-fidelity Mockups and a reusable Design System.","link":null,"color":"teal"},{"id":"p2-b3","icon":"fa-mouse-pointer","title":"Prototyping & Feedback","description":"Interactive Prototypes and crucial User Testing before development.","link":null,"color":"teal"}]},{"id":"phase-3","title":"Phase 3: Development","boxes":[{"id":"p3-b1","icon":"fa-cogs","title":"Setup & Architecture","description":"Version Control (Git), Project Scaffolding, Database Schema Design.","link":null,"color":"green"},{"id":"p3-b2","icon":"fa-key","title":"Core Feature Development","description":"Authentication, Authorization, Frontend, and Backend/API development.","link":null,"color":"green"},{"id":"p3-b3","icon":"fa-plug","title":"Third-Party Integrations","description":"Connecting to payment gateways and other essential services.","link":null,"color":"green"},{"id":"p3-b4","icon":"fa-bug","title":"Testing","description":"Unit Tests, Integration Tests, and End-to-End (E2E) Tests.","link":null,"color":"green"}]},{"id":"phase-4","title":"Phase 4: Deployment","boxes":[{"id":"p4-b1","icon":"fa-server","title":"Infrastructure Setup","description":"Staging & Production environments, Cloud Services, Infrastructure as Code.","link":null,"color":"orange"},{"id":"p4-b2","icon":"fa-sync-alt","title":"CI/CD Pipeline","description":"Automated testing (Continuous Integration) and deployment (Continuous Deployment).","link":null,"color":"orange"},{"id":"p4-b3","icon":"fa-play-circle","title":"The Launch Sequence","description":"Final tests on staging, backing up production, deploy, and monitor.","link":null,"color":"orange"}]},{"id":"phase-5","title":"Phase 5: Operations & Maintenance","boxes":[{"id":"p5-b1","icon":"fa-chart-line","title":"Monitoring & Alerting","description":"Uptime Monitoring, Application Performance Monitoring (APM), Error Tracking.","link":null,"color":"red"},{"id":"p5-b2","icon":"fa-file-alt","title":"Logging","description":"Centralized application and server logs for debugging complex issues.","link":null,"color":"red"},{"id":"p5-b3","icon":"fa-shield-alt","title":"Backup & Disaster Recovery","description":"Automated database backups and testing the recovery process.","link":null,"color":"red"},{"id":"p5-b4","icon":"fa-lock","title":"Security","description":"Regularly update dependencies, perform audits and penetration testing.","link":null,"color":"red"},{"id":"p5-b5","icon":"fa-expand-arrows-alt","title":"Scaling","description":"Vertical and Horizontal scaling to handle increased load.","link":null,"color":"red"}]},{"id":"phase-6","title":"Phase 6: Client Onboarding & Support","boxes":[{"id":"p6-b1","icon":"fa-sign-in-alt","title":"Client Sign-in & Account Management","description":"Self-service area for profile, password, and subscription management.","link":null,"color":"purple"},{"id":"p6-b2","icon":"fa-graduation-cap","title":"Onboarding","description":"Welcome Emails, In-App Tutorials, and providing a helpful initial state.","link":null,"color":"purple"},{"id":"p6-b3","icon":"fa-headset","title":"Customer Support System","description":"Knowledge Base, Help Desk/Ticketing System, and defined Support Channels.","link":null,"color":"purple"},{"id":"p6-b4","icon":"fa-sync","title":"Feedback Loop & Iteration","description":"Actively collect user feedback to inform the roadmap and repeat the cycle.","link":null,"color":"purple"}]}]}};

    async function saveState() {
        await window.electronAPI.store.set('flowchartProjectData', projectData);
        updateStatus('Project saved');
    }

    async function loadState() {
        projectData = await window.electronAPI.store.get('flowchartProjectData') || JSON.parse(JSON.stringify(defaultData));
        renderAll();
    }

    function updateStatus(message) {
        statusText.textContent = message;
        setTimeout(() => { statusText.textContent = 'Ready'; }, 3000);
    }
    
    function findBoxById(boxId) {
        for (const flowKey in projectData.flows) {
            const flow = projectData.flows[flowKey];
            const allBoxes = Array.isArray(flow) ? flow.flatMap(p => p.boxes) : (flow.boxes || []);
            const box = allBoxes.find(b => b.id === boxId);
            if (box) return box;
        }
        return null;
    }
    
    function renderAll() {
        if (currentSubFlowId) renderSubFlow(currentSubFlowId);
        else renderMainFlowchart();
    }

    function createPhaseBoxHTML(box) {
        const hasFolder = box.linkedFolderPath ? 'border-green-500 ring-2 ring-green-500' : '';
        const hasSubflow = projectData.flows[box.id] ? 'border-purple-500 ring-2 ring-purple-500' : '';
        const color = box.color || 'gray';
        return `<div class="phase-box bg-${color}-100 border-2 border-${color}-300 dark:bg-${color}-900 dark:border-${color}-700 rounded-lg p-4 text-center z-10 ${hasFolder} ${hasSubflow}" data-box-id="${box.id}"><i class="fas ${box.icon} text-2xl text-${color}-600 dark:text-${color}-400 mb-2"></i><h3 class="font-semibold text-${color}-800 dark:text-${color}-200">${box.title}</h3><p class="text-sm text-${color}-600 dark:text-${color}-300 mt-2">${box.description}</p></div>`;
    }

    function renderMainFlowchart() {
        mainFlowchartContainer.innerHTML = projectData.flows.main.map(phase => {
             const gridColsClass = phase.boxes.length === 5 ? 'lg:grid-cols-5' : phase.boxes.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4';
             return `<div class="phase-container" data-phase-id="${phase.id}"><h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4 text-center">${phase.title}</h2><div class="grid grid-cols-1 md:grid-cols-2 ${gridColsClass} gap-6 mb-8">${phase.boxes.map(createPhaseBoxHTML).join('')}</div></div>`
        }).join('');
    }

    function renderSubFlow(subFlowId) {
        currentSubFlowId = subFlowId;
        const flowData = projectData.flows[subFlowId];
        const parentBox = findBoxById(subFlowId);
        subFlowTitle.textContent = parentBox.title;
        subFlowBoxesContainer.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">${(flowData.boxes || []).map(createPhaseBoxHTML).join('')}</div>`;
        mainView.classList.add('hidden');
        subFlowView.classList.remove('hidden');
    }

    // LEFT-CLICK for direct actions
    document.body.addEventListener('click', (e) => {
        const boxElement = e.target.closest('.phase-box');
        if (boxElement) {
            const boxId = boxElement.dataset.boxId;
            const boxData = findBoxById(boxId);

            if (boxData && boxData.linkedFolderPath) {
                window.electronAPI.openPath(boxData.linkedFolderPath);
                return;
            }
            if (projectData.flows[boxId]) {
                renderSubFlow(boxId);
                return;
            }
        }
    });

    // RIGHT-CLICK for the action modal
    document.body.addEventListener('contextmenu', (e) => {
        const boxElement = e.target.closest('.phase-box');
        if (boxElement) {
            e.preventDefault(); // Prevent default system right-click menu
            currentlySelectedBoxId = boxElement.dataset.boxId;
            updateAndShowModal();
        }
    });
    
    function updateAndShowModal() {
        const box = findBoxById(currentlySelectedBoxId);
        if (!box) return;
        unlinkFolderBtn.classList.toggle('hidden', !box.linkedFolderPath);
        deleteSubflowBtn.classList.toggle('hidden', !projectData.flows[box.id]);
        linkFolderBtn.textContent = box.linkedFolderPath ? 'Change Folder Link...' : 'Link to a Folder...';
        actionModal.classList.add('active');
    }

    // Modal button listeners
    closeModalBtn.addEventListener('click', () => actionModal.classList.remove('active'));

    linkFolderBtn.addEventListener('click', async () => {
        const folderPath = await window.electronAPI.openFolderDialog();
        if (folderPath) {
            const box = findBoxById(currentlySelectedBoxId);
            box.linkedFolderPath = folderPath;
            await saveState();
            renderAll();
            updateStatus('Folder linked!');
        }
        actionModal.classList.remove('active');
    });
    
    createSubflowBtn.addEventListener('click', async () => {
        if (!projectData.flows[currentlySelectedBoxId]) {
            projectData.flows[currentlySelectedBoxId] = { boxes: [] };
            await saveState();
        }
        renderSubFlow(currentlySelectedBoxId);
        actionModal.classList.remove('active');
    });

    unlinkFolderBtn.addEventListener('click', async () => {
        const box = findBoxById(currentlySelectedBoxId);
        if (box && confirm('Are you sure you want to unlink this folder?')) {
            box.linkedFolderPath = null;
            await saveState();
            renderAll();
            updateStatus('Folder unlinked.');
        }
        actionModal.classList.remove('active');
    });

    deleteSubflowBtn.addEventListener('click', async () => {
        if (projectData.flows[currentlySelectedBoxId] && confirm('Are you sure you want to delete this sub-flow and all its steps? This cannot be undone.')) {
            delete projectData.flows[currentlySelectedBoxId];
            await saveState();
            renderAll();
            updateStatus('Sub-flow deleted.');
        }
        actionModal.classList.remove('active');
    });
    
    backToMainBtn.addEventListener('click', () => {
        subFlowView.classList.add('hidden');
        mainView.classList.remove('hidden');
        currentSubFlowId = null;
        renderAll();
    });

    addNewBoxBtn.addEventListener('click', async () => {
        if (!currentSubFlowId) return;
        const flow = projectData.flows[currentSubFlowId];
        const parentBox = findBoxById(currentSubFlowId);
        const newBox = { id: `sf-${currentSubFlowId}-${Date.now()}`, icon: 'fa-cube', title: 'New Step', description: 'Click to edit description.', color: parentBox.color || 'gray' };
        if(!flow.boxes) flow.boxes = [];
        flow.boxes.push(newBox);
        await saveState();
        renderSubFlow(currentSubFlowId);
    });

    await loadState();
});
