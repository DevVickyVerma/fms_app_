import React, { useEffect, useState } from "react";
import withApi from "../../../Utils/ApiHelper";
import { Link, useParams } from "react-router-dom";
import Loaderimg from "../../../Utils/Loader";
import { useFormik } from "formik";
import * as Yup from "yup";
import { handleError } from "../../../Utils/ToastUtils";

const SiteCardOpening = (props) => {
  const { getData, postData, isLoading } =
    props;

  const [data, setData] = useState();
  const { id } = useParams(); // Destructure id from useParams()

  const GetListing = async () => {
    // Removed the id parameter since it's already being captured from useParams()
    try {
      const response = await getData(
        `/site/card-opening/list?site_id=${id}&month=4&year=2024`
      );
      if (response) {

        setData(response?.data?.data);
        formik.setValues(response?.data?.data);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    GetListing();
  }, []);
  const validationSchema = Yup.object().shape({
    group_card: Yup.array().of(
      Yup.object().shape({
        cards: Yup.array().of(
          Yup.object().shape({
            value: Yup.number()
              .required("Card value is required")
              .positive("Value must be positive"),
         
            amexValue: Yup.number().positive().when("$cardName", {
              is: "Amex",
              then: Yup.number().min(Yup.ref("value"), "Amex value must be greater than or equal to its value")
            })
          })
        )
      })
    )
  });
  const onSubmit = async (values) => {
    try {
      console.log(values, "values");
      const formData = new FormData();
      formData.append(`site_id`, id);
      formData.append(`year`, 2024);
      formData.append(`month`, 4);
      
      values.group_card.forEach((group) => {
        group.cards.forEach((card) => {
          formData.append(`value[${card.id}]`, card.value);
        });
      });

      const postDataUrl = "site/card-opening/add";
      const navigatePath = "/manageitems";

      await postData(postDataUrl, formData);
    } catch (error) {
      handleError(error);
    }
  };

  const formik = useFormik({
    initialValues: { group_card: data?.group_card || [] },
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  });


  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      {data ? (
        <form onSubmit={formik.handleSubmit}>
          <div className="row">
            {formik.values?.group_card.map((group) => (
              <div className="col-12 col-lg-6" key={group.group_id}>
                <div className="card mb-3">
                  <div className="card-header">
                    <h4 className="card-title" style={{ minHeight: "32px" }}>
                      {group.name}
                    </h4>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      {group.cards.map((card) => (
                        <div className="col-6" key={card.id}>
                          <div className="form-group">
                            <label className="form-label" htmlFor={card.id}>
                              {card.name} <span className="text-danger">*</span>
                            </label>
                            <input
                              id={card.id}
                              name={`group_card.${formik.values.group_card.indexOf(group)}.cards.${group.cards.indexOf(card)}.value`}
                              type="number"
                              className={`input101 ${
                                formik.errors.group_card?.[formik.values.group_card.indexOf(group)]?.cards?.[group.cards.indexOf(card)]?.value && formik.touched.group_card?.[formik.values.group_card.indexOf(group)]?.cards?.[group.cards.indexOf(card)]?.value
                                  ? "is-invalid"
                                  : ""
                              }`}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.group_card?.[formik.values.group_card.indexOf(group)]?.cards?.[group.cards.indexOf(card)]?.value}
                            />
                            {formik.errors.group_card?.[formik.values.group_card.indexOf(group)]?.cards?.[group.cards.indexOf(card)]?.value && formik.touched.group_card?.[formik.values.group_card.indexOf(group)]?.cards?.[group.cards.indexOf(card)]?.value ? (
                              <div className="invalid-feedback">
                                {formik.errors.group_card[formik.values.group_card.indexOf(group)].cards[group.cards.indexOf(card)].value}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="card-footer text-end">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      ) : null}
    </>
  );
};

export default withApi(SiteCardOpening);
