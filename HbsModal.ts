interface HbsModalOptions {
    params?: any;
    submit?: Function;
    show?: Function;
    shown?: Function;
    hide?: Function;
    hidden?: Function;
    parent?: string|JQuery;
    draggable?: boolean;
}

class HbsModal {

    private hbs: string;

    private $modal: JQuery = null;

    /**
     * Constructor HbsModal
     *
     * @param hbs
     * @param options
     */
    constructor(hbs: string, options?: HbsModalOptions) {

        this.hbs = hbs;

        if (options) {

            this.render(options);
        }
    }

    /**
     * Bootstrap modal show
     *
     * @param options
     * @param bsOptions
     * @returns {JQuery}
     */
    public render = (options: HbsModalOptions, bsOptions?: any) => {

        if (!this.$modal) {

            let $modal: any = $(influencingHbs[this.hbs](options.params));

            ($modal.is('form') ? $modal : $modal.find('form'))
                .on('submit', (event: Event) => {
                    event.preventDefault();
                    if (options.submit instanceof Function) {
                        options.submit(event, this.$modal);
                    }
                });

            $modal
                .on('show.bs.modal', (event: Event) => {

                    if (options.show instanceof Function) {
                        options.show(event, $modal);
                    }
                })
                .on('shown.bs.modal', (event: Event) => {

                    this.$modal.find('[autofocus]').focus();

                    if (options.shown instanceof Function) {
                        options.shown(event, this.$modal);
                    }

                    if (options.draggable) {

                        $modal
                            .css('max-width', $modal.find('.modal-content').width())
                            .addClass('center-block')
                            .css('left', $modal.css('margin-left'))
                            .css('margin-left', 0)
                            .find('.modal-content').css('cursor', 'move')
                        ;

                        if (!options.parent) {
                            $('body').removeClass('modal-open');
                        }
                    }

                })
                .on('hide.bs.modal', (event) => {

                    if (options.hide instanceof Function) {
                        options.hide(event, $modal);
                    }
                })
                .on('hidden.bs.modal', (event) => {

                    this.$modal.remove();
                    this.$modal = null;

                    if (options.hidden instanceof Function) {
                        options.hidden(event);
                    }
                });

            if (options.parent) {

                $(options.parent).append($modal);

            } else {

                $('body').append($modal);
            }

            app.initSelect2Ables();

            if (options.draggable) {
                $modal.draggable();
                bsOptions = bsOptions || {};
                bsOptions.backdrop = false;
            }

            this.$modal = $modal;

            $modal.modal(bsOptions ? bsOptions : undefined);
        }

        return this.$modal;
    };

    /**
     * Bootstrap modal destroy
     */
    public destroy = () => this.$modal.modal('hide');

    public getModal = () => {
        return this.$modal;
    };
}
