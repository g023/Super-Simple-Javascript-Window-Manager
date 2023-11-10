/*
<!-- 
    program: Super Simple Javascript Window Manager
    license: BSD 3-Clause License (https://opensource.org/licenses/BSD-3-Clause)
    version: 0.1a
    description: A simple minimalist window manager for javascript that uses jquery, jquery-ui.
    tested with: jquery v3.5.1, jquery-ui v1.13.0
    author: https://github.com/g023
    url: https://github.com/g023/Super-Simple-Javascript-Window-Manager
    
    categories in order of relevance: javascript, jquery, jquery-ui, window manager, window, javascript, dialog, gui, user interface, frontend
    
    a short bit about:
        This is a simple minimalist window manager that uses jquery, jquery-ui. It allows you to create draggable, resizable windows with close buttons. 
        It also allows you to focus windows, set css, and set content. Intention is to keep things simple and easy to understand. Manipulations mostly handled with CSS.
    
    features:
        - draggable windows
        - resizable windows
        - closeable windows
        - focus window
        - set css
        - set content
    
    usage:
            // first include js for class WM_Window then... 
            <script src="Simple_Window.js"></script>

            <script>
                // create our window object
                const window1 = new WM_Window(name, '<p>Content of ' + name + '</p>');
                // initialize and show window   
                window1.createWindow(name);
                // set width and height
                window1.setCss('width', 400);
                window1.setCss('height', 100);
                // random x y position
                const x = Math.floor(Math.random() * 200 + 200);
                const y = Math.floor(Math.random() * 200 + 200);
                window1.setCss('top', x);
                window1.setCss('left', y);
                // replace content
                window1.setContent('<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.</p>');
                // force focus
                window1.focusWindow();
            </script>
-->
*/
        // a global 
        let g_last_id = 1;
        let g_last_z = 91;
        class Simple_Window {

            // uses global g_last_z to keep track of z-index
            // uses global g_last_id to keep track of id

            constructor(title, content) {
                
                this.id = g_last_id;
                g_last_id += 1;

                this.title = title;
                this.content = content;
                this.windowElement = null;
                this.dragHandle = null;
                this.isDragging = false;
                this.offsetX = 0;
                this.offsetY = 0;
                this.windowElement = null;
            }

            createWindow(addclass = '') {
                console.log('createWindow');

                this.windowElement = $('<div winid="'+ this.id +'" class="window ' + addclass + '"></div>');
                this.windowTitle = $('<div class="window-title"></div>').text(this.title);
                this.dragHandle = $('<div class="drag-handle"></div>')
                this.closeButton = $('<div class="close-button"></div>');
                this.content = $('<div class="content"></div>').append(this.content);

                // join everything together
                this.windowElement.append(this.dragHandle, this.windowTitle, this.closeButton, this.content);

                // throw it into the DOM
                $('body').append(this.windowElement);

                this.dragHandle.on('mousedown', (event) => this.startDragging(event));
                this.closeButton.on('click', () => this.closeWindow());

                // when window clicked focus it
                this.windowElement.on('click', () => this.focusWindow());

                // when user drags an edge of the window, stretch it
                this.windowElement.resizable({
                    handles: 'n, e, s, w, ne, se, sw, nw',
                    resize: (event, ui) => this.focusWindow(),
                });

                return this.windowElement;
            }

            focusWindow() {
                g_last_z += 1;
                this.windowElement.css('z-index', g_last_z);
                // remove class .isfocused on all other windows
                $('.window').removeClass('isfocused');
                // add class .isfocused to this window
                this.windowElement.addClass('isfocused');
            }

            startDragging(event) {
                this.isDragging = true;
                this.offsetX = event.pageX - this.windowElement.offset().left;
                this.offsetY = event.pageY - this.windowElement.offset().top;

                $(document).on('mousemove', (event) => this.dragWindow(event));
                $(document).on('mouseup', () => this.stopDragging());
            }

            dragWindow(event) {
                // focus
                this.focusWindow();
                if (this.isDragging) {
                    // console.log('dragging');
                    // if we drag above window or off the window to the left
                    // force  min to show 0,0

                    const left = event.pageX - this.offsetX;
                    const top = event.pageY - this.offsetY;

                    this.windowElement.css({ left, top });

                    // restrict coordinates to positive
                    if (left < 0) {
                        this.windowElement.css({ left: 0 });
                    }
                    if (top < 0) {
                        this.windowElement.css({ top: 0 });
                    }
                }
            }

            stopDragging() {
                this.isDragging = false;
                $(document).off('mousemove');
                $(document).off('mouseup');
            }

            closeWindow() {
                // focus
                this.focusWindow();


                // confirm after waiting a brief moment // helps with focus
                setTimeout(() => {
                    if (confirm('Are you sure you want to close this window?')) {
                        // this.windowElement.remove();
                        // fadeout and then remove
                        this.windowElement.fadeOut(100, () => {
                            this.windowElement.remove();
                        });
                    }
                }, 100);
            }

            // now some other things
            setCss(the_css, the_css_val) { // eg) setCss('background-color', 'red');
                this.windowElement.css(the_css, the_css_val);
            }
            
            setContent(content) {
                this.content.html(content);
            }

        }

