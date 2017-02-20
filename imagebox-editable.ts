import {ImageboxEditableProperties} from "imagebox-editable";

const ImageboxEditable = (function () {

        const imageboxSelector = '.imagebox-editable';
        const imageboxInitedProp = 'imagebox-editable-inited';

        const $editBtn = $('<button>', {
            'class': 'btn btn-success btn-sm imagebox-edit-btn',
            css: {
                position: 'absolute',
                top: '5px',
                right: 0
            },
            text: 'Edit'
        });

        $editBtn.click(function () {

            const $imageBox = $(this).closest(imageboxSelector);
            let imageDropzone: Dropzone;

            new Modal('image_upload_modal', {
                show: function (event, $modal) {

                    var $submitBtn = $modal.find('button[type="submit"]');

                    var $imageDropzone = $modal.find('.dropzone');

                    imageDropzone = new Dropzone($imageDropzone.get(0), {
                        url: Routing.generate('upload_file'),
                        acceptedFiles: '.jpeg, .png, .jpg, .tiff, .gif',
                        maxFilesize: 4,
                        maxFiles: 2, // only 2
                        dictDefaultMessage: '<i class="fa fa-file"></i> Click or drag files there. image formats are supported',
                        addRemoveLinks: true
                    });

                    imageDropzone
                        .on('sending', function() {
                            this.removeAllFiles();
                            $submitBtn.prop('disabled', true);
                        })
                        .on('error', function(file, error) {
                            app.createNotification(typeof  error === 'string' ? error : error.message, 'danger');
                            this.removeFile(file);
                        })
                        .on('complete', () => $submitBtn.prop('disabled', false));
                },
                params: {},
                submit: (event: Event, $modal: JQuery) => {

                    const $submitBtn = $modal.find('button[type="submit"]');
                    const $image = $imageBox.find('img').first();

                    const acceptedFiles = imageDropzone.getAcceptedFiles();
                    if (acceptedFiles.length) {

                        const acceptedFile = acceptedFiles[0];

                        const formData = $.extend({}, $imageBox.data('options'), {
                            image: {
                                filename: acceptedFile.name,
                                url:      acceptedFile.xhr.response
                            }
                        });

                        const savingRoute = $imageBox.data('saving-route');
                        if (savingRoute) {

                            $submitBtn.mask();
                            $.ajax({
                                url: savingRoute,
                                method: 'post',
                                dataType: 'json',
                                data: formData,
                                success: (response: AjaxResponse) => {

                                    if (response.type === 'success') {

                                        $image.prop('src', formData['image']['url']);
                                        $modal.modal('hide');
                                    }

                                    app.createNotification(response.message, response.type);
                                },
                                error: (err) => {
                                    console.error(err);

                                    app.createNotification('Unknown error', 'danger');
                                },
                                complete: () => $submitBtn.unmask()
                            });

                        } else {

                            $image.prop('src', formData['imgUrl']);
                            $modal.modal('hide');
                        }

                    } else {

                        app.createNotification('<b>Warning!</b> You should select image', 'warning');
                    }
                }
            });
        });

        const onMouseover = function () {
            $(this).prepend($editBtn.clone(true))
        };

        const onMouseout = function () {
            $(this).find('.imagebox-edit-btn').remove();
        };

        let result = {

            defaultConfig: {
                autoinit: true
            },

            init(imageBox: HTMLDivElement): void {

                const $imageBox = $(imageBox);
                $imageBox
                    .css('position', 'relative')
                    .hover(onMouseover, onMouseout)
                    .data(this.DATA_IMAGEBOX_EDITABLE_INITED, true);

                onMouseover.call($imageBox);
            }
        };

        // Create readonly properties
        Object.defineProperties(result, {
            CLASS_IMAGEBOX_EDITABLE: {
                value: imageboxSelector,
                configurable: false,
                writable: false
            },
            DATA_IMAGEBOX_EDITABLE_INITED: {
                value: imageboxInitedProp,
                configurable: false,
                writable: false
            }
        });

        return result;
    }()) as ImageboxEditableProperties;

    $.fn.imageboxEditable = function () {
        return this.each(function() {
            ImageboxEditable.init(this);
        });
    };

    if (ImageboxEditable.defaultConfig.autoinit) {
        $(document).on('mouseover', ImageboxEditable.CLASS_IMAGEBOX_EDITABLE, function () {
            if (!$(this).data(ImageboxEditable.DATA_IMAGEBOX_EDITABLE_INITED)) {
                ImageboxEditable.init(this);
            }
        });
    }
