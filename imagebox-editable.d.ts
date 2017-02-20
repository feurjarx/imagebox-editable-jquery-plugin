export interface ImageboxEditableProperties {
    CLASS_IMAGEBOX_EDITABLE?: string;
    DATA_IMAGEBOX_EDITABLE_INITED?: string;

    defaultConfig: {
        autoinit: boolean;
    };

    init(div: HTMLDivElement): void;
}
