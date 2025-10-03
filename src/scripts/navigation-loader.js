/**
 * Navigation loader for shared menu system
 * Loads navigation data from navigation.json and renders it dynamically
 */
(function() {
    'use strict';

    var NavigationLoader = {
        /**
         * Helper function to get short name from longname
         */
        getShortName: function(longname) {
            if (!longname.includes('module:')) {
                return longname;
            }
            if (longname.includes('|')) {
                return longname;
            }
            if (longname.includes('<')) {
                return longname;
            }
            return longname.split(/[\~\.#\:]/).pop();
        },

        /**
         * Creates a link to a documentation page
         */
        linkto: function(item, text, cssClass, fragmentId) {
            text = text || item.name || this.getShortName(item.longname);
            
            var url = item.url || (item.longname + '.html');
            if (fragmentId) {
                url += '#' + fragmentId;
            }
            var classAttr = cssClass ? ' class="' + cssClass + '"' : '';
            return '<a href="' + url + '"' + classAttr + '>' + text + '</a>';
        },

        /**
         * Creates a tutorial link
         */
        tutoriallink: function(tutorial) {
            return '<em class="disabled">Tutorial: ' + tutorial + '</em>';
        },

        /**
         * Determines if an item can be styled as namespace
         */
        canStyleAsNamespace: function(item) {
            return item.type === 'namespace' || item.type === 'module';
        },

        /**
         * Renders a navigation item
         */
        renderItem: function(item) {
            var self = this;
            var html = '';
            var canStyle = this.canStyleAsNamespace(item);
            var deprecatedClass = item.deprecated ? ' status-deprecated' : '';
            
            html += '<li class="item' + deprecatedClass + '" data-name="' + 
                    (item.type === 'tutorial' ? 'tutorial-' : '') + item.longname + '">';
            
            html += '<span class="title' + (canStyle ? ' namespace' : '') + deprecatedClass + '">';
            
            if (canStyle) {
                var iconClass = (item.longname === 'global') ? 'globe' : 'folder-open';
                html += '<span class="namespaceTag"><span class="glyphicon glyphicon-' + iconClass + '"></span></span>';
            } else {
                html += '<span class="namespaceTag"><span class="glyphicon glyphicon-minus"></span></span>';
            }

            if (item.type === 'module') {
                html += this.linkto(item, item.name);
            } else if (item.type === 'tutorial') {
                html += '<span class="namespaceTag"><span class="glyphicon glyphicon-education"></span></span>';
                html += this.tutoriallink(item.longname);
            } else {
                var displayName = item.longname === 'global' ? 'Global' : item.longname.replace(/^module:/, '');
                html += this.linkto(item, displayName);
            }

            html += '</span>';

            // Render members
            if (item.members && item.members.length) {
                html += '<ul class="members itemMembers">';
                html += '<span class="subtitle">Members</span>';
                item.members.forEach(function(member) {
                    var parentClass = (!member.inherited && !member.inherits) ? ' parent' : '';
                    var memberDeprecated = member.deprecated ? ' status-deprecated' : '';
                    html += '<li class="' + parentClass + memberDeprecated + '" data-name="' + member.longname + '">';
                    html += self.linkto(member, member.name);
                    html += '</li>';
                });
                html += '</ul>';
            }

            // Render typedefs
            if (item.typedefs && item.typedefs.length) {
                html += '<ul class="typedefs itemMembers">';
                html += '<span class="subtitle">Typedefs</span>';
                item.typedefs.forEach(function(typedef) {
                    html += '<li class="parent" data-name="' + typedef.longname + '">';
                    html += self.linkto(typedef, typedef.name);
                    html += '</li>';
                });
                html += '</ul>';
            }

            // Render interfaces
            if (item.interfaces && item.interfaces.length) {
                html += '<ul class="typedefs itemMembers">';
                html += '<span class="subtitle">Interfaces</span>';
                item.interfaces.forEach(function(iface) {
                    html += '<li class="parent" data-name="' + iface.longname + '">';
                    html += self.linkto(iface, iface.name);
                    html += '</li>';
                });
                html += '</ul>';
            }

            // Render methods
            if (item.methods && item.methods.length) {
                html += '<ul class="methods itemMembers">';
                html += '<span class="subtitle">Methods</span>';
                item.methods.forEach(function(method) {
                    var parentClass = (!method.inherited && !method.inherits) ? ' parent' : '';
                    var methodDeprecated = method.deprecated ? ' status-deprecated' : '';
                    html += '<li class="' + parentClass + methodDeprecated + '" data-name="' + method.longname + '">';
                    html += self.linkto(method, method.name);
                    html += '</li>';
                });
                html += '</ul>';
            }

            // Render events
            if (item.events && item.events.length) {
                html += '<ul class="events itemMembers">';
                html += '<span class="subtitle">Events</span>';
                item.events.forEach(function(event) {
                    var parentClass = (!event.inherited && !event.inherits) ? ' parent' : '';
                    html += '<li class="' + parentClass + '" data-name="' + event.longname + '">';
                    html += self.linkto(event, event.name);
                    html += '</li>';
                });
                html += '</ul>';
            }

            // Render children (recursive)
            if (item.children && item.children.length) {
                html += '<ul class="children itemMembers">';
                html += '<span class="subtitle"></span>';
                item.children.forEach(function(child) {
                    html += self.renderItem(child);
                });
                html += '</ul>';
            }

            html += '</li>';
            return html;
        },

        /**
         * Renders the complete navigation
         */
        renderNavigation: function(navData) {
            var html = '';
            html += '<div class="navigation">';
            html += '<h3 class="applicationName"><a href="index.html">' + navData.applicationName + '</a></h3>';
            html += '<button id="menuToggle" class="btn btn-link btn-lg menu-toggle">';
            html += '<span class="glyphicon glyphicon-menu-hamburger"></span>';
            html += '</button>';
            html += '<div class="search">';
            html += '<input id="search" type="text" class="form-control input-md" placeholder="Search...">';
            html += '</div>';
            html += '<ul class="list">';

            var self = this;
            navData.nav.forEach(function(item) {
                html += self.renderItem(item);
            });

            html += '</ul>';
            html += '</div>';
            return html;
        },

        /**
         * Gets the relative path to navigation.json from the current page
         */
        getNavigationPath: function() {
            return 'navigation.json';
        },

        /**
         * Loads navigation data and renders it
         */
        loadNavigation: function() {
            var self = this;
            var navPath = this.getNavigationPath();
            
            console.log('Loading navigation from:', navPath);
            
            // Try to use fetch if available, otherwise fall back to XMLHttpRequest
            if (typeof fetch !== 'undefined') {
                fetch(navPath)
                    .then(function(response) {
                        console.log('Navigation response:', response.status);
                        if (!response.ok) {
                            throw new Error('Failed to load navigation data: ' + response.status);
                        }
                        return response.json();
                    })
                    .then(function(navData) {
                        console.log('Navigation data loaded:', navData);
                        self.injectNavigation(navData);
                    })
                    .catch(function(error) {
                        console.error('Error loading navigation:', error);
                    });
            } else {
                // Fallback for older browsers
                var xhr = new XMLHttpRequest();
                xhr.open('GET', navPath, true);
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        console.log('XHR response:', xhr.status);
                        if (xhr.status === 200) {
                            try {
                                var navData = JSON.parse(xhr.responseText);
                                console.log('Navigation data loaded via XHR:', navData);
                                self.injectNavigation(navData);
                            } catch (e) {
                                console.error('Error parsing navigation data:', e);
                            }
                        } else {
                            console.error('Failed to load navigation data:', xhr.status);
                        }
                    }
                };
                xhr.send();
            }
        },

        /**
         * Injects the navigation HTML into the page
         */
        injectNavigation: function(navData) {
            console.log('Injecting navigation...');
            var navigationHtml = this.renderNavigation(navData);
            var container = document.getElementById('navigation-container');
            console.log('Navigation container found:', !!container);
            if (container) {
                container.innerHTML = navigationHtml;
                console.log('Navigation HTML injected');
                
                // Highlight and move current page to top
                this.highlightCurrentPage();
                
                // Trigger a custom event to let other scripts know navigation is loaded
                var event = new CustomEvent('navigationLoaded');
                document.dispatchEvent(event);
            } else {
                console.error('Navigation container not found');
            }
        },

        /**
         * Highlights the current page in navigation and moves it to top
         */
        highlightCurrentPage: function() {
            var nav = document.querySelector('.navigation');
            var list = nav.querySelector('.list');
            if (!nav || !list) return;

            // Get current page filename from page title or URL
            var pageTitle = document.querySelector('.page-title');
            var filename = '';
            
            if (pageTitle && pageTitle.dataset.filename) {
                filename = pageTitle.dataset.filename.replace(/\.[a-z]+$/, '');
            } else {
                // Fallback: extract from current URL
                var path = window.location.pathname;
                filename = path.substring(path.lastIndexOf('/') + 1).replace('.html', '');
            }

            if (filename) {
                // Find the navigation item that matches the current page
                var currentItem = nav.querySelector('a[href*="' + filename + '"]');
                if (currentItem) {
                    var itemElement = currentItem.closest('.item');
                    if (itemElement) {
                        // If this is a child item, highlight it and expand parent
                        if (itemElement.closest('.children')) {
                            itemElement.classList.add('current');
                            // Make all children not current except this one
                            var siblings = itemElement.parentElement.querySelectorAll('li.item');
                            siblings.forEach(function(sibling) {
                                if (sibling !== itemElement) {
                                    sibling.classList.add('notCurrent');
                                }
                            });
                            // Find the top-level parent
                            var topParent = itemElement.closest('.list > .item');
                            if (topParent) {
                                itemElement = topParent;
                            }
                        }
                        
                        // Move to top and highlight
                        itemElement.classList.add('current');
                        list.insertBefore(itemElement, list.firstChild);
                    }
                }
            }
        }
    };

    // Auto-load navigation when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            NavigationLoader.loadNavigation();
        });
    } else {
        NavigationLoader.loadNavigation();
    }

    // Export for use in other scripts
    window.NavigationLoader = NavigationLoader;
})();
