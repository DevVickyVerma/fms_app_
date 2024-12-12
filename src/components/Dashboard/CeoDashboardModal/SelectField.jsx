import React from 'react';
import { Col } from 'react-bootstrap'; // Or your preferred layout library

const SelectField = ({
    label,
    id,
    name,
    value,
    options = [],
    onChange,
    required = false,
    placeholder = ""
}) => {
    return (
        <Col lg={6}>
            <label className="form-label" htmlFor={id}>
                {label} {required && <span className="text-danger">*</span>}
            </label>
            <select
                id={id}
                name={name}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="input101"
            >
                {placeholder ? <option value="">{placeholder}</option> : ""}
                {options?.map((item) => (
                    <option key={item.id} value={item.id}>
                        {item.name || item.company_name || item.site_name}
                    </option>
                ))}
            </select>
        </Col>
    );
};

export default SelectField;
