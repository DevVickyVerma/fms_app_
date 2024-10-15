import React from 'react';
import classNames from 'classnames';

const FormikInput = ({
    formik,
    name,
    label = '',
    type = 'text',
    placeholder,
    className: customClassName = '',
    isRequired = true,
    readOnly = false,
    maxDate = '',
}) => {
    const dynamicLabel =
        label ||
        name
            .replace(/_/g, ' ')
            .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    const dynamicPlaceholder =
        placeholder ||
        name
            .replace(/_/g, ' ')
            .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

    // Determine if the field has errors
    const hasError = formik.submitCount > 0 && formik.errors[name] && formik.touched[name];

    // Extract error message(s) for the field
    let errorMessages;
    if (hasError) {
        const error = formik.errors[name];
        if (typeof error === 'string') {
            errorMessages = error;
        } else if (Array.isArray(error) && error.length > 0) {
            errorMessages = error.join(', ');
        } else if (typeof error === 'object' && error !== null) {
            errorMessages = Object.values(error).join(', ');
        }
    }

    const inputClassName = classNames(
        {
            'input101': type !== 'range' && type !== 'textarea',
            'form-range': type === 'range',
            'form-control-plaintext': type === 'plaintext',
            'form-control-color': type === 'color',
            'text-danger': hasError,
            readOnly: readOnly,
        },
        type === 'date' && 'input101',
        type === 'textarea' && 'input101',
        customClassName
    );

    const handleShowDate = (index) => {
        const inputDateElement = document.querySelector(`#${index}`);
        if (inputDateElement && inputDateElement.showPicker) {
            inputDateElement.showPicker();
        }
    };

    const maxDateValue = maxDate || "";

    const renderInput = () => {
        switch (type) {
            case 'textarea':
                return (
                    <textarea
                        name={name}
                        id={name}
                        readOnly={readOnly}
                        placeholder={dynamicPlaceholder}
                        className={inputClassName}
                        autoComplete="off"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values[name]}
                    />
                );
            case 'date':
                return (
                    <input
                        name={name}
                        type={type}
                        id={name}
                        readOnly={readOnly}
                        placeholder={dynamicPlaceholder}
                        autoComplete="off"
                        className={inputClassName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        onClick={() => handleShowDate(name)}
                        value={formik.values[name]}
                        min={dynamicPlaceholder === 'date' ? '2024-06-25' : ''}
                        max={maxDateValue} // Apply maxDate
                        onKeyDown={(e) => e.preventDefault()}
                        onKeyUp={(e) => e.preventDefault()}
                    />
                );
            case 'month':
                return (
                    <input
                        name={name}
                        type={type}
                        id={name}
                        readOnly={readOnly}
                        placeholder={dynamicPlaceholder}
                        autoComplete="off"
                        className={inputClassName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        onClick={() => handleShowDate(name)}
                        value={formik.values[name]}
                        min={dynamicPlaceholder === 'date' ? '2024-06-25' : ''}
                        max={dynamicPlaceholder === 'date' ? '2024-06-27' : ''}
                        onKeyDown={(e) => e.preventDefault()}
                        onKeyUp={(e) => e.preventDefault()}
                    />
                );
            case 'datetime-local':
                return (
                    <input
                        name={name}
                        type={type}
                        id={name}
                        readOnly={readOnly}
                        placeholder={dynamicPlaceholder}
                        autoComplete="off"
                        className={inputClassName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        onClick={() => handleShowDate(name)}
                        value={formik.values[name]}
                        min={dynamicPlaceholder === 'date' ? '2024-06-25' : ''}
                        max={dynamicPlaceholder === 'date' ? '2024-06-27' : ''}
                        onKeyDown={(e) => e.preventDefault()}
                        onKeyUp={(e) => e.preventDefault()}
                    />
                );
            default:
                return (
                    <input
                        name={name}
                        type={type}
                        autoComplete="off"
                        id={name}
                        readOnly={readOnly}
                        placeholder={dynamicPlaceholder}
                        className={inputClassName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values[name]}
                    />
                );
        }
    };

    return (
        <div className='form-group'>
            <label htmlFor={name} className="mb-2">
                {dynamicLabel}
                {isRequired && <span className="text-danger">*</span>}
            </label>

            {renderInput()}

            {hasError && <div className="text-danger mt-1">{errorMessages}</div>}
        </div>
    );
};

export default FormikInput;
