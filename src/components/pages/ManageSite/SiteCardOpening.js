import React, { useEffect, useState } from "react";
import withApi from "../../../Utils/ApiHelper";
import { Link, useParams } from "react-router-dom";
import Loaderimg from "../../../Utils/Loader";
import { useFormik } from "formik";
import * as Yup from "yup";
import { handleError } from "../../../Utils/ToastUtils";

const SiteCardOpening = (props) => {
  const { apidata, error, getData, postData, SiteID, ReportDate, isLoading } =
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
        console.log(response, "GetListing");
        setData(response?.data?.data);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    GetListing();
  }, []);

  useEffect(() => {
    const allCards = data?.group_card.flatMap((group) => group.cards);
    console.log(allCards, "allCards");
  }, [data]);

  const validationSchema = Yup.object().shape({
    // You can define validation rules here
  });

  const onSubmit = async (values) => {
    try {
      const responsestructure = {
        group_card: Object.entries(values).map(([cardId, value]) => {
          const group = data?.group_card.find((group) =>
            group?.cards.some((card) => card.id === cardId)
          );
          const card = group?.cards.find((card) => card.id === cardId);
          return {
            group_id: group.group_id,
            card_id: cardId,
            card_name: card.name, // Include card name in the form data
            value: value,
          };
        }),
      };

      const formData = new FormData();
      formData.append(`site_id`, id);
      formData.append(`year`, 2024);
      formData.append(`month`, 4);
      responsestructure.group_card.forEach(({ card_id, value }) => {
        formData.append(`value[${card_id}]`, value);
      });

      const postDataUrl = "site/card-opening/add";
      const navigatePath = "/manageitems";

      await postData(postDataUrl, formData);
    } catch (error) {
      handleError(error);
    }
  };

  const initialValues = {};
  if (data) {
    data.group_card.forEach((group) => {
      group.cards.forEach((card) => {
        initialValues[card.id] = card.value || 0;
      });
    });
  }

  // Initialize Formik
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });
  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      {data ? (
        <form onSubmit={formik.handleSubmit}>
          <div className="row">
            {data.group_card.map((group) => (
              <div className="col-6" key={group.group_id}>
                <div className="card mb-3">
                  <div className="card-header">
                    <h3>{group.name}</h3>
                  </div>

                  <div className="card-body">
                    {group.cards.map((card) => (
                      <div className="col-12" key={card.id}>
                        <div className="form-group">
                          <label className="form-label" htmlFor={card.id}>
                            {card.name} <span className="text-danger">*</span>
                          </label>

                          
                          <input
                            id={card.id}
                            name={card.id}
                            type="number"
                            className={`input101 ${
                              formik.errors[card.id] && formik.touched[card.id]
                                ? "is-invalid"
                                : ""
                            }`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values[card.id]} // Display the value of the card
                          />
                          {formik.touched[card.id] && formik.errors[card.id] ? (
                            <div className="invalid-feedback">
                              {formik.errors[card.id]}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ))}
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
