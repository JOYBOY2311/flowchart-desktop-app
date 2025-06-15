document.addEventListener('DOMContentLoaded', async () => {
    // --- DOM ELEMENT REFERENCES ---
    const themeToggle = document.getElementById('theme-toggle');
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    const lightIcon = document.getElementById('theme-toggle-light-icon');
    const mainView = document.getElementById('main-view');
    const subFlowView = document.getElementById('sub-flow-view');
    const mainFlowchartContainer = document.getElementById('main-flowchart-container');
    const subFlowTitle = document.getElementById('sub-flow-title');
    const subFlowBoxesContainer = document.getElementById('sub-flow-boxes-container');
    const backToMainBtn = document.getElementById('back-to-main');
    const addNewBoxBtn = document.getElementById('add-new-box-btn');
    const appHeader = document.getElementById('app-header');
    const statusBar = document.getElementById('status-bar');
    const statusText = document.getElementById('status-text');
    const projectInfo = document.getElementById('project-info');

    // Modal elements
    const actionModal = document.getElementById('action-modal');
    const createSubflowBtn = document.getElementById('create-subflow-btn');
    const createLinkBtn = document.getElementById('create-link-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');

    // --- STATE MANAGEMENT ---
    let projectData = {};
    let currentlySelectedBoxId = null;
    let currentSubFlowId = null;

    const defaultData = {
        projectName: "The Complete SaaS Application Lifecycle",
        theme: "light",
        flows: {
            main: [
                { id: 'phase-1', title: 'Phase 1: Planning & Discovery', boxes: [
                    { id: 'p1-b1', icon: 'fa-search', title: 'Idea Validation & Market Research', description: 'Problem-Solution Fit, Competitor Analysis, Target Audience, SEO Strategy.', link: null, color: 'blue' },
                    { id: 'p1-b2', icon: 'fa-list-ol', title: 'Feature Prioritization & MVP Scoping', description: 'Core Functionality, MoSCoW Method, Minimum Viable Product (MVP).', link: null, color: 'blue' },
                    { id: 'p1-b3', icon: 'fa-dollar-sign', title: 'Monetization Strategy', description: 'Pricing Model, Billing Cycle, Payment Gateway Selection.', link: null, color: 'blue' },
                    { id: 'p1-b4', icon: 'fa-layer-group', title: 'Technology Stack Selection', description: 'Frontend, Backend, Database, and Infrastructure choices.', link: null, color: 'blue' }
                ]},
                { id: 'phase-2', title: 'Phase 2: Design & Prototyping', boxes: [
                    { id: 'p2-b1', icon: 'fa-sitemap', title: 'User Experience (UX) Design', description: 'User Flows and Wireframing to define structure and functionality.', link: null, color: 'teal' },
                    { id: 'p2-b2', icon: 'fa-paint-brush', title: 'User Interface (UI) Design', description: 'High-fidelity Mockups and a reusable Design System.', link: null, color: 'teal' },
                    { id: 'p2-b3', icon: 'fa-mouse-pointer', title: 'Prototyping & Feedback', description: 'Interactive Prototypes and crucial User Testing before development.', link: null, color: 'teal' }
                ]},
                { id: 'phase-3', title: 'Phase 3: Development', boxes: [
                    { id: 'p3-b1', icon: 'fa-cogs', title: 'Setup & Architecture', description: 'Version Control (Git), Project Scaffolding, Database Schema Design.', link: null, color: 'green' },
                    { id: 'p3-b2', icon: 'fa-key', title: 'Core Feature Development', description: 'Authentication, Authorization, Frontend, and Backend/API development.', link: null, color: 'green' },
                    { id: 'p3-b3', icon: 'fa-plug', title: 'Third-Party Integrations', description: 'Connecting to payment gateways and other essential services.', link: null, color: 'green' },
                    { id: 'p3-b4', icon: 'fa-bug', title: 'Testing', description: 'Unit Tests, Integration Tests, and End-to-End (E2E) Tests.', link: null, color: 'green' }
                ]},
                { id: 'phase-4', title: 'Phase 4: Deployment', boxes: [
                    { id: 'p4-b1', icon: 'fa-server', title: 'Infrastructure Setup', description: 'Staging & Production environments, Cloud Services, Infrastructure as Code.', link: null, color: 'orange' },
                    { id: 'p4-b2', icon: 'fa-sync-alt', title: 'CI/CD Pipeline', description: 'Automated testing (Continuous Integration) and deployment (Continuous Deployment).', link: null, color: 'orange' },
                    { id: 'p4-b3', icon: 'fa-play-circle', title: 'The Launch Sequence', description: 'Final tests on staging, backing up production, deploy, and monitor.', link: null, color: 'orange' }
                ]},
                { id: 'phase-5', title: 'Phase 5: Operations & Maintenance', boxes: [
                    { id: 'p5-b1', icon: 'fa-chart-line', title: 'Monitoring & Alerting', description: 'Uptime Monitoring, Application Performance Monitoring (APM), Error Tracking.', link: null, color: 'red' },
                    { id: 'p5-b2', icon: 'fa-file-alt', title: 'Logging', description: 'Centralized application and server logs for debugging complex issues.', link: null, color: 'red' },
                    { id: 'p5-b3', icon: 'fa-shield-alt', title: 'Backup & Disaster Recovery', description: 'Automated database backups and testing the recovery process.', link: null, color: 'red' },
                    { id: 'p5-b4', icon: 'fa-lock', title: 'Security', description: 'Regularly update dependencies, perform audits and penetration testing.', link: null, color: 'red' },
                    { id: 'p5-b5', icon: 'fa-expand-arrows-alt', title: 'Scaling', description: 'Vertical and Horizontal scaling to handle increased load.', link: null, color: 'red' }
                ]},
                { id: 'phase-6', title: 'Phase 6: Client Onboarding & Support', boxes: [
                    { id: 'p6-b1', icon: 'fa-sign-in-alt', title: 'Client Sign-in & Account Management', description: 'Self-service area for profile, password, and subscription management.', link: null, color: 'purple' },
                    { id: 'p6-b2', icon: 'fa-graduation-cap', title: 'Onboarding', description: 'Welcome Emails, In-App Tutorials, and providing a helpful initial state.', link:null, color: 'purple' },
                    { id: 'p6-b3', icon: 'fa-headset', title: 'Customer Support System', description: 'Knowledge Base, Help Desk/Ticketing System, and defined Support Channels.', link: null, color: 'purple' },
                    { id: 'p6-b4', icon: 'fa-sync', title: 'Feedback Loop & Iteration', description: 'Actively collect user feedback to inform the roadmap and repeat the cycle.', link: null, color: 'purple' }
                ]}
            ]
        }
    };

    // --- ELECTRON STORAGE FUNCTIONS ---
    async function saveState() {
        try {
            await window.electronAPI.store.set('flowchartProjectData', projectData);
            updateStatus('Project saved');
        } catch (error) {
            console.error('Failed to save state:', error);
            updateStatus('Failed to save project');
        }
    }

    async function loadState() {
        try {
            const savedData = await window.electronAPI.store.get('flowchartProjectData');
            projectData = savedData || JSON.parse(JSON.stringify(defaultData));
            applyTheme();
            renderMainFlowchart();
            updateProjectInfo();
            updateStatus('Project loaded');
        } catch (error) {
            console.error('Failed to load state:', error);
            projectData = JSON.parse(JSON.stringify(defaultData));
            applyTheme();
            renderMainFlowchart();
            updateProjectInfo();
            updateStatus('Using default project');
        }
    }

    function updateStatus(message) {
        statusText.textContent = message;
        setTimeout(() => {
            statusText.textContent = 'Ready';
        }, 3000);
    }

    function updateProjectInfo() {
        projectInfo.textContent = `Project: ${projectData.projectName}`;
    }

    function findBoxById(boxId) {
        for (const flowKey in projectData.flows) {
            const flow = projectData.flows[flowKey];
            if (Array.isArray(flow)) { // Main flow (array of phases)
                 for (const phase of flow) {
                    const box = phase.boxes.find(b => b.id === boxId);
                    if(box) return box;
                }
            } else { // Sub-flow (object with a boxes array)
                const box = flow.boxes.find(b => b.id === boxId);
                if(box) return box;
            }
        }
        return null;
    }

    // --- THEME MANAGEMENT ---
    function applyTheme() {
        if (projectData.theme === 'dark') {
            document.documentElement.classList.add('dark');
            darkIcon.classList.remove('hidden');
            lightIcon.classList.add('hidden');
            appHeader.classList.add('dark');
            statusBar.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
            darkIcon.classList.add('hidden');
            lightIcon.classList.remove('hidden');
            appHeader.classList.remove('dark');
            statusBar.classList.remove('dark');
        }
    }

    themeToggle.addEventListener('click', async () => {
        projectData.theme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
        applyTheme();
        await saveState();
    });

    // --- RENDERING LOGIC ---
    function createPhaseBoxHTML(box) {
        const hasLink = box.link ? 'border-blue-500 ring-2 ring-blue-500' : '';
        const hasSubflow = projectData.flows[box.id] ? 'border-purple-500 ring-2 ring-purple-500' : '';
        const color = box.color || 'gray'; // Fallback color

        return `
            <div class="phase-box bg-${color}-100 border-2 border-${color}-300 dark:bg-${color}-900 dark:border-${color}-700 rounded-lg p-4 text-center z-10 ${hasLink} ${hasSubflow}" data-box-id="${box.id}">
                <i class="fas ${box.icon} text-2xl text-${color}-600 dark:text-${color}-400 mb-2"></i>
                <h3 class="font-semibold text-${color}-800 dark:text-${color}-200" contenteditable="true" data-property="title">${box.title}</h3>
                <p class="text-sm text-${color}-600 dark:text-${color}-300 mt-2" contenteditable="true" data-property="description">${box.description}</p>
            </div>
        `;
    }

    function renderMainFlowchart() {
        let html = `
            <div class="text-center mb-8" style="margin-top: 2rem;">
                <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4" contenteditable="true" id="project-title">
                    ${projectData.projectName}
                </h1>
            </div>
        `;

        projectData.flows.main.forEach(phase => {
            const gridColsClass = phase.boxes.length === 5 ? 'lg:grid-cols-5' : 
                                  phase.boxes.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4';
            html += `
                <div class="phase-container" data-phase-id="${phase.id}">
                    <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4 text-center">${phase.title}</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 ${gridColsClass} gap-6 mb-8">
                        ${phase.boxes.map(createPhaseBoxHTML).join('')}
                    </div>
                </div>
            `;
        });

        mainFlowchartContainer.innerHTML = html;
        // Add bottom padding to avoid status bar overlap
        mainFlowchartContainer.style.paddingBottom = '4rem';
    }

    function renderSubFlow(subFlowId) {
        currentSubFlowId = subFlowId;
        const flowData = projectData.flows[subFlowId];
        if (!flowData) return;

        const parentBox = findBoxById(subFlowId);
        subFlowTitle.textContent = parentBox.title;

        subFlowBoxesContainer.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                ${flowData.boxes.map(createPhaseBoxHTML).join('')}
            </div>
        `;

        mainView.classList.add('hidden');
        subFlowView.classList.remove('hidden');
        // Add bottom padding to avoid status bar overlap
        subFlowView.style.paddingBottom = '4rem';
    }

    // --- EVENT LISTENERS ---

    // Content Editable Logic
    document.body.addEventListener('blur', async (e) => {
        if (e.target.hasAttribute('contenteditable')) {
            if (e.target.id === 'project-title') {
                projectData.projectName = e.target.textContent;
                updateProjectInfo();
            } else {
                const boxId = e.target.closest('.phase-box').dataset.boxId;
                const property = e.target.dataset.property;
                const box = findBoxById(boxId);
                if (box) {
                    box[property] = e.target.textContent;
                }
            }
            await saveState();
        }
    }, true); // Use capture to ensure blur event is caught

    // Phase Box Click Logic
    document.body.addEventListener('click', (e) => {
        if (e.target.hasAttribute('contenteditable')) return; // Ignore clicks on editable text

        const boxElement = e.target.closest('.phase-box');
        if (boxElement) {
            const boxId = boxElement.dataset.boxId;
            const boxData = findBoxById(boxId);

            if(boxData && boxData.link) {
                // If a link exists, open it with shell
                require('electron').shell.openExternal(boxData.link);
            } else {
                // Otherwise, show the action modal
                currentlySelectedBoxId = boxId;
                actionModal.classList.add('active');
            }
        }
    });

    // Modal Logic
    closeModalBtn.addEventListener('click', () => actionModal.classList.remove('active'));

    createLinkBtn.addEventListener('click', async () => {
        const box = findBoxById(currentlySelectedBoxId);
        const currentLink = box.link || '';
        const newLink = prompt(
            "Enter a URL (e.g., https://example.com) or a local file path (e.g., file:///C:/Users/YourUser/Documents).\n\nNOTE: Local file links will open with the system default application.",
            currentLink
        );

        if (newLink !== null) { // User didn't press cancel
            box.link = newLink;
            await saveState();
            renderAll();
            updateStatus('Link updated');
        }
        actionModal.classList.remove('active');
    });

    createSubflowBtn.addEventListener('click', async () => {
        if (!projectData.flows[currentlySelectedBoxId]) {
            // Create a new sub-flow if it doesn't exist
            projectData.flows[currentlySelectedBoxId] = { boxes: [] };
            await saveState();
        }
        actionModal.classList.remove('active');
        renderSubFlow(currentlySelectedBoxId);
    });

    // Sub-flow view logic
    backToMainBtn.addEventListener('click', () => {
        subFlowView.classList.add('hidden');
        mainView.classList.remove('hidden');
        currentSubFlowId = null;
        renderAll(); // Re-render to show link/subflow indicators
    });

    addNewBoxBtn.addEventListener('click', async () => {
        if (!currentSubFlowId) return;
        const flow = projectData.flows[currentSubFlowId];
        const parentBox = findBoxById(currentSubFlowId);

        const newBox = {
            id: `sf-${currentSubFlowId}-${Date.now()}`,
            icon: 'fa-cube',
            title: 'New Step',
            description: 'Click to edit description.',
            link: null,
            color: parentBox.color || 'gray'
        };
        flow.boxes.push(newBox);
        await saveState();
        renderSubFlow(currentSubFlowId);
        updateStatus('New step added');
    });

    function renderAll() {
        if (currentSubFlowId) {
            renderSubFlow(currentSubFlowId);
        } else {
            renderMainFlowchart();
        }
    }

    // --- MENU EVENT HANDLERS ---
    if (window.electronAPI) {
        // Handle menu events from main process
        window.electronAPI.onMenuNewProject(() => {
            if (confirm('Create a new project? This will reset all current data.')) {
                projectData = JSON.parse(JSON.stringify(defaultData));
                renderMainFlowchart();
                updateProjectInfo();
                updateStatus('New project created');
                saveState();
            }
        });

        window.electronAPI.onMenuExportData((event, filePath) => {
            // Export functionality would be implemented here
            const dataToExport = JSON.stringify(projectData, null, 2);
            // This would need to be implemented in the main process
            updateStatus('Export functionality to be implemented');
        });

        window.electronAPI.onMenuImportData((event, filePath) => {
            // Import functionality would be implemented here
            updateStatus('Import functionality to be implemented');
        });
    }

    // --- INITIALIZATION ---
    await loadState();
});