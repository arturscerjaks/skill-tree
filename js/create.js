// Data structure for SkillTree
class SkillTree {
    constructor(title, design = {}) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
        this.design = {
            tokenShape: design.tokenShape || 'circle',
            theme: design.theme || 'default',
            ...design
        };
        this.skillBranches = [];
    }
}

class SkillBranch {
    constructor(title) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.skills = [];
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }
}

class Skill {
    constructor(title, description = '') {
        this.id = crypto.randomUUID();
        this.title = title;
        this.description = description;
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }
}

function initCreate() {
    return {
        // Form data
        title: '',
        design: {
            tokenShape: 'circle',
            theme: 'default'
        },

        // UI state
        creationStep: 'skill-tree-list',
        errorMessage: '',
        successMessage: '',
        trees: [],
        selectedTree: null,

        // Initialize component
        init() {
            this.trees = this.getAllTrees();

            this.$watch('selectedTree', (newVal) => {
                if (newVal) {
                    this.creationStep = 'skill-tree';
                } else {
                    this.creationStep = 'skill-tree-list';
                }
            });
        },

        // Create a new skill tree
        createTree() {
            try {
                if (!this.title.trim()) {
                    throw new Error('Title is required');
                }

                const newTree = new SkillTree(this.title, this.design);
                
                // Update reactive trees array
                this.trees.push(newTree);
                
                // Save to localStorage
                localStorage.setItem('skillTrees', JSON.stringify(this.trees));
                
                // Reset form
                this.title = '';
                this.addSuccess('Skill Tree created successfully!');

                return newTree;
            } catch (error) {
                this.addError(error.message);
            }
        },

        // Get all trees from localStorage
        getAllTrees() {
            const treesJson = localStorage.getItem('skillTrees');
            return treesJson ? JSON.parse(treesJson) : [];
        },

        // Delete a skill tree
        async deleteTree(treeId) {
            try {
                // Show confirmation modal
                const modal = document.querySelector('modal-base');
                modal.setContent({
                    header: '<h2 class="text-xl font-bold">Delete Skill Tree</h2>',
                    content: '<p>Are you sure you want to delete this skill tree? This action cannot be undone.</p>',
                    actions: `
                        <button class="button secondary" data-action="cancel">Cancel</button>
                        <button class="button danger" data-action="confirm">Delete</button>
                    `
                });

                // Wait for user confirmation
                try {
                    await modal.show();
                } catch (e) {
                    // User cancelled
                    return;
                }

                // Update reactive trees array
                this.trees = this.trees.filter(tree => tree.id !== treeId);

                // Save to localStorage
                localStorage.setItem('skillTrees', JSON.stringify(this.trees));
                
                this.addSuccess('Skill Tree deleted successfully!');
            } catch (error) {
                this.addError(error.message);
            }
        },

        // Update a skill tree
        updateTree(treeId, updates) {
            try {
                const treeIndex = this.trees.findIndex(tree => tree.id === treeId);
                
                if (treeIndex === -1) {
                    throw new Error('Skill Tree not found');
                }

                this.trees[treeIndex] = {
                    ...this.trees[treeIndex],
                    ...updates,
                    updatedAt: new Date().toISOString()
                };

                localStorage.setItem('skillTrees', JSON.stringify(this.trees));
                this.addSuccess('Skill Tree updated successfully!');
            } catch (error) {
                this.addError(error.message);
            }
        },

        // View a skill tree
        viewTree(treeId) {
            this.selectedTree = this.trees.find(tree => tree.id === treeId) || null;
            if (!this.selectedTree) {
                this.addError('Skill Tree not found');
            }
        },
        addError(message) {
            this.errorMessage = message;
            setTimeout(() => {
                this.errorMessage = '';
            }, 10000);
        },
        addSuccess(message) {
            this.successMessage = message;
            setTimeout(() => {
                this.successMessage = '';
            }, 3000);
        },

        addSkillBranch() {
            try {
                const modal = document.querySelector('modal-base');
                modal.setContent({
                    header: '<h2 class="text-xl font-bold">Add Skill Branch</h2>',
                    content: `
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="branch-title">
                                Branch Title
                            </label>
                            <input id="branch-title"
                                   class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                   type="text"
                                   placeholder="Enter branch title">
                        </div>
                    `,
                    actions: `
                        <button class="button secondary" data-action="cancel">Cancel</button>
                        <button class="button primary" data-action="confirm">Add Branch</button>
                    `
                });

                modal.show().then(() => {
                    const title = document.getElementById('branch-title').value;
                    if (!title?.trim()) {
                        throw new Error('Branch title is required');
                    }

                    const newBranch = new SkillBranch(title);
                    this.selectedTree.skillBranches.push(newBranch);
                    
                    this.updateTree(this.selectedTree.id, this.selectedTree);
                    this.addSuccess('Skill Branch added successfully!');
                }).catch(error => {
                    if (error !== 'cancelled') {
                        this.addError(error.message);
                    }
                });
            } catch (error) {
                this.addError(error.message);
            }
        },

        addSkillToBranch(branchId) {
            try {
                const modal = document.querySelector('modal-base');
                modal.setContent({
                    header: '<h2 class="text-xl font-bold">Add Skill</h2>',
                    content: `
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="skill-title">
                                Skill Title
                            </label>
                            <input id="skill-title"
                                   class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                   type="text"
                                   placeholder="Enter skill title">
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="skill-description">
                                Description (optional)
                            </label>
                            <textarea id="skill-description"
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Enter skill description"></textarea>
                        </div>
                    `,
                    actions: `
                        <button class="button secondary" data-action="cancel">Cancel</button>
                        <button class="button primary" data-action="confirm">Add Skill</button>
                    `
                });

                modal.show().then(() => {
                    const title = document.getElementById('skill-title').value;
                    const description = document.getElementById('skill-description').value;

                    if (!title?.trim()) {
                        throw new Error('Skill title is required');
                    }

                    const newSkill = new Skill(title, description);
                    const branch = this.selectedTree.skillBranches.find(b => b.id === branchId);
                    
                    if (!branch) {
                        throw new Error('Branch not found');
                    }

                    branch.skills.push(newSkill);
                    this.updateTree(this.selectedTree.id, this.selectedTree);
                    this.addSuccess('Skill added successfully!');
                }).catch(error => {
                    if (error !== 'cancelled') {
                        this.addError(error.message);
                    }
                });
            } catch (error) {
                this.addError(error.message);
            }
        },

        deleteSkillBranch(branchId) {
            try {
                const modal = document.querySelector('modal-base');
                modal.setContent({
                    header: '<h2 class="text-xl font-bold">Delete Branch</h2>',
                    content: '<p>Are you sure you want to delete this branch and all its skills?</p>',
                    actions: `
                        <button class="button secondary" data-action="cancel">Cancel</button>
                        <button class="button danger" data-action="confirm">Delete Branch</button>
                    `
                });

                modal.show().then(() => {
                    this.selectedTree.skillBranches = this.selectedTree.skillBranches.filter(
                        branch => branch.id !== branchId
                    );
                    
                    this.updateTree(this.selectedTree.id, this.selectedTree);
                    this.addSuccess('Skill Branch deleted successfully!');
                }).catch(error => {
                    if (error !== 'cancelled') {
                        this.addError(error.message);
                    }
                });
            } catch (error) {
                this.addError(error.message);
            }
        },

        editSkill(branchId, skillId) {
            try {
                const branch = this.selectedTree.skillBranches.find(b => b.id === branchId);
                const skill = branch.skills.find(s => s.id === skillId);

                if (!branch || !skill) {
                    throw new Error('Skill not found');
                }

                const modal = document.querySelector('modal-base');
                const showEditForm = () => {
                    modal.setContent({
                        header: '<h2 class="text-xl font-bold">Edit Skill</h2>',
                        content: `
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="skill-title">
                                    Skill Title
                                </label>
                                <input id="skill-title"
                                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                       type="text"
                                       placeholder="Enter skill title"
                                       value="${skill.title}">
                            </div>
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="skill-description">
                                    Description (optional)
                                </label>
                                <textarea id="skill-description"
                                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
                                        placeholder="Enter skill description">${skill.description || ''}</textarea>
                            </div>
                        `,
                        actions: `
                            <button class="button danger" data-action="delete">Delete Skill</button>
                            <div class="flex gap-2">
                                <button class="button secondary" data-action="cancel">Cancel</button>
                                <button class="button primary" data-action="confirm">Save Changes</button>
                            </div>
                        `
                    });
                };

                const showDeleteConfirmation = () => {
                    modal.setContent({
                        header: '<h2 class="text-xl font-bold">Delete Skill</h2>',
                        content: '<p>Are you sure you want to delete this skill? This action cannot be undone.</p>',
                        actions: `
                            <button class="button secondary" data-action="cancel">Back</button>
                            <button class="button danger" data-action="confirm-delete">Delete</button>
                        `
                    });
                };

                const handleModalClick = (e) => {
                    const action = e.target.dataset.action;
                    if (action === 'delete') {
                        showDeleteConfirmation();
                    } else if (action === 'confirm-delete') {
                        branch.skills = branch.skills.filter(s => s.id !== skillId);
                        this.updateTree(this.selectedTree.id, this.selectedTree);
                        this.addSuccess('Skill deleted successfully!');
                        modal.hide();
                    } else if (action === 'cancel' && e.target.parentElement.querySelector('[data-action="confirm-delete"]')) {
                        showEditForm(); // Go back to edit form if canceling delete confirmation
                    }
                };

                modal.addEventListener('click', handleModalClick);
                showEditForm();

                modal.show().then(() => {
                    const newTitle = document.getElementById('skill-title').value.trim();
                    const newDescription = document.getElementById('skill-description').value.trim();

                    if (!newTitle) {
                        throw new Error('Skill title is required');
                    }

                    // Update skill properties
                    skill.title = newTitle;
                    skill.description = newDescription;
                    skill.updatedAt = new Date().toISOString();

                    this.updateTree(this.selectedTree.id, this.selectedTree);
                    this.addSuccess('Skill updated successfully!');
                }).catch(error => {
                    if (error !== 'cancelled') {
                        this.addError(error.message);
                    }
                }).finally(() => {
                    modal.removeEventListener('click', handleModalClick);
                });
            } catch (error) {
                this.addError(error.message);
            }
        },

        editTreeTitle() {
            try {
                const modal = document.querySelector('modal-base');
                modal.setContent({
                    header: '<h2 class="text-xl font-bold">Edit Skill Tree Title</h2>',
                    content: `
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="tree-title">
                                Skill Tree Title
                            </label>
                            <input id="tree-title"
                                   class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                   type="text"
                                   placeholder="Enter title"
                                   value="${this.selectedTree.title}">
                        </div>
                    `,
                    actions: `
                        <button class="button secondary" data-action="cancel">Cancel</button>
                        <button class="button primary" data-action="confirm">Save Changes</button>
                    `
                });

                modal.show().then(() => {
                    const newTitle = document.getElementById('tree-title').value.trim();
                    if (!newTitle) {
                        throw new Error('Title is required');
                    }

                    this.selectedTree.title = newTitle;
                    this.selectedTree.updatedAt = new Date().toISOString();
                    this.updateTree(this.selectedTree.id, this.selectedTree);
                    this.addSuccess('Skill Tree title updated successfully!');
                }).catch(error => {
                    if (error !== 'cancelled') {
                        this.addError(error.message);
                    }
                });
            } catch (error) {
                this.addError(error.message);
            }
        }
    };
}
