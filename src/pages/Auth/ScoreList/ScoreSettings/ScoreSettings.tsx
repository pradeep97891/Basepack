import React, {
  FocusEvent,
  ChangeEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import "./ScoreSettings.scss";
import {
  Form,
  Row,
  Col,
  Flex,
  Typography,
  Checkbox,
  Select,
  Space,
  Button,
  Card,
  Input,
  Tooltip,
  DatePicker,
  notification,
} from "antd";
import DescriptionHeader, {
  ItineraryHeaderProps,
} from "@/components/DescriptionHeader/DescriptionHeader";
import { useTranslation } from "react-i18next";
import { usePostDataServiceMutation } from "@/services/reschedule/Reschedule";
import { ScoreCardDataInterface } from "@/services/reschedule/RescheduleTypes";
import ConfirmModalPopup from "@/components/ConfirmModalPopup/ConfirmModalPopup";
import { useLocation} from "react-router-dom";
import { useRedirect } from "@/hooks/Redirect.hook";
import Toastr, { ToastrProps } from "@/components/Toastr/Toastr";
import ScoreSettingsSkeleton from "./ScoreSettings.skeleton";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useSessionStorage } from "@/hooks/BrowserStorage.hook";
import { DefaultOptionType } from "antd/es/select";
import dayjs from 'dayjs';
import { useGetCreateScoreDataMutation, useGetScoreListMutation } from "@/services/reschedule/Reschedule";
import { getDynamicDate } from "@/Utils/general";
const { Text } = Typography;
// const { Option } = Select;
const { RangePicker } = DatePicker;


const ScoreSettings = () => {
  const { t } = useTranslation(); // Used for translation
  const [createScoreService, createScoreResponse] = useGetCreateScoreDataMutation(); // Getting service hit data for this page
  const [scoreListService, scoreListResponse] = useGetScoreListMutation();
  const [scoreCardDataObj, setScoreCardDataObj] = useState<any>(); // Variable for getting data
  const [scoreCardDataTemp, setScoreCardDataTemp] = useState<any>(); // Variable for getting data as temp
  const [visible, setVisible] = useState<boolean>(false); // Boolean for select dropdown
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false); // Boolean to collapse the tab contents
  const [passengerSelectedValues, setPassengerSelectedValues] = useState<string[]>([]); // Variable to get passenger content details
  const [flightSelectedValues, setFlightSelectedValues] = useState<string[]>([]); // Variable to get flight content details
  const [formSubmitValue, setFormSubmitValue] = useState<any>();
  const [selectedButton, setSelectedButton] = useState<string>("Passenger"); // Variable to get tab selection data
  const [rowData, setRowData] = useState<
    | { operation: string; parent: string; index: number; scoreattr: string }
    | undefined
  >(undefined);
  const {currentPath, redirect, isCurrentPathEqual} = useRedirect();
  let tempSelectValue: string[] = []; // Variable to get selected selected value
  const inputRefs = useRef<HTMLInputElement[]>([]); // References for the input check boxes in score select dropdown
  const [btnDisable, setBtnDisable] = useState<boolean>(true);
  const [scoreListData, setScoreListData] = useState<any>();
  const [scoreOption] = useSessionStorage<any>("scoreListOption");
  const [checked, setChecked] = useState(false);
  const [applied, setApplied] = useState(false);
  const [SeditScoreData] = useSessionStorage<any>("editScoreData");
  const [postQueuePNRListService] = usePostDataServiceMutation<any>();
  var filteredOptions: DefaultOptionType[] | undefined;

  const [popupData, setPopupData] = useState({
    modalName: "confirm",
    page: "scoreSettings",
    header: t("confirm_score_saving_header"),
    description: t("confirm_score_saving_description"),
    modalToggle: false,
    modalClass: "",
    modalWidth: 540,
    primaryBtn: { text: t("cancel"), value: false },
    secondaryBtn: { text: t("sure"), value: "default" },
    type: "default",
  });

  let toastrPropsData: ToastrProps["data"] = {
    title: `Error Message`,
    description: `Kindly type in this format only +1.0 or -1.0 in between -5.0 to +5.0..`,
    position: "topRight",
    type: "error",
    top: 100,
    right: 100,
    duration: 5,
    className: "cls-score-toastr",
  };

  interface ToastrComponent {
    childFunction(): void;
  }

  const childRef = useRef<ToastrComponent>(null);

  // Call the function in the child component directly from the parent
  const callChildFunction = () => {
    if (childRef.current) {
      childRef.current.childFunction();
    }
  };

  // To trigger initial service hit to get data
  useEffect(() => {
    createScoreService({});
    scoreListService([]);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (createScoreResponse.isSuccess) {
      var dataSet = SeditScoreData ? {
        [SeditScoreData?.[0]?.scoreSet] : SeditScoreData[0]?.score
      } : {};
      var data = SeditScoreData ? dataSet : (createScoreResponse.data as any).response.data[0];
      setScoreCardDataObj(data);
      setScoreCardDataTemp(data);

      var paxSelectList: string[] = [];
      var flightSelectList: string[] = [];

      Object.entries(data)?.map(
        ([key, mainData]: [string, any]) => {
          if (mainData) {
            mainData.map((data: any) => {
              data.scoreAttributes?.map((loopData: any) => {
                if (loopData.selected === true) {
                  data.title === "Passenger"
                    ? paxSelectList.push(loopData.type)
                    : flightSelectList.push(loopData.type);
                }
              });
            });
          }
        }
      );
      scoreOption === "Passenger" ? setPassengerSelectedValues(paxSelectList) : setFlightSelectedValues(flightSelectList);
      setIsCollapsed(true);
      setSelectedButton(SeditScoreData ? SeditScoreData[0]?.scoreSet : scoreOption);
      if (SeditScoreData) {
        setChecked(true);
        setApplied(true);
      }
    }
    if (scoreListResponse.isSuccess) {
      setScoreListData((scoreListResponse.data as any).response.data);
    }
  }, [createScoreResponse, scoreListResponse]);


  useEffect(() => {
    if (!passengerSelectedValues.length && !flightSelectedValues.length) {
      setBtnDisable(true);
    }
  }, [passengerSelectedValues, flightSelectedValues]);

  // Data for match conditions to be displayed
  const matchData = [
    { class: "best", content: "best_match", count: `(${t("greater_than")} 3)` },
    {
      class: "medium",
      content: "Moderate match",
      count: `(${t("between")} 3-1)`,
    },
    { class: "worst", content: "Least match", count: `(${t("less_than")} 1)` },
  ];

  // Function for on change event in the input box in score select dropdown of each tabs
  const onChangeSelect = (
    parent: string,
    type: string,
    masterObj: any = ""
  ) => {
    var localVar =
      masterObj !== ""
        ? masterObj
        : JSON.parse(JSON.stringify(scoreCardDataObj));
    if (localVar) {
      Object.entries(localVar).forEach(([key, value]: [string, any]) => {
        value.forEach((data: { title: string; scoreAttributes: any[] }) => {
          data.title === parent &&
            (data.scoreAttributes = data.scoreAttributes.map(
              (scoreData: any) => {
                if (scoreData.type === type) {
                  scoreData.selected = !scoreData.selected;
                }
                return scoreData;
              }
            ));
        });
      });
    }
    setScoreCardDataObj(localVar);
  };

  // Function calling after clicking apply in the score select dropdown
  const applyChanges = (scoreTitle: string) => {
    const checkboxes = document.querySelectorAll(
      ".cls-dropdown .ant-checkbox-input"
    ) as NodeListOf<HTMLInputElement>;
    checkboxes.forEach((inputEle: HTMLInputElement) => {
      inputEle.checked && tempSelectValue.push(inputEle.value);
    });
    scoreTitle === "Passenger"
      ? setPassengerSelectedValues(tempSelectValue)
      : setFlightSelectedValues(tempSelectValue);
    setApplied(true);
    setChecked(tempSelectValue.length ? true : false);
    setVisible(!visible);
    setIsCollapsed(true);
    // setBtnDisable(false);
    tempSelectValue = [];
  };

  useEffect(() => {
    if (checked && applied) {
      scoreForm.validateFields(["scoreAttributes"]);
    }
  }, [checked, applied])

  // Properties to be passed to render header in score settings page
  let headerProps: ItineraryHeaderProps["data"] = {
    title: t(
      isCurrentPathEqual("editScoreSettings")
        ? `Edit ${scoreOption.toLowerCase()} - score settings`
        : `${scoreOption} - score settings`
    ),
    description: `${t("score_settings_description")}`,
    breadcrumbProps: [
      {
        path: "dashboard",
        title: t("dashboard"),
        breadcrumbName: "Dashboard",
        key: "Dashboard",
      },
      {
        path: "scoreList",
        title: "Score list",
        breadcrumbName: "Score list",
        key: "Score list",
      },
      {
        path: currentPath,
        title: t(
          isCurrentPathEqual("editScoreSettings")
            ? `Edit ${scoreOption.toLowerCase()} - score settings`
            : `${scoreOption} - score settings`
        ),
        breadcrumbName: t(
          isCurrentPathEqual('editScoreSettings')
            ? `Edit ${scoreOption.toLowerCase()} - score settings`
            : `${scoreOption} - score settings`
        ),
        key: t(
          isCurrentPathEqual('editScoreSettings')
            ? `Edit ${scoreOption.toLowerCase()} - score settings`
            : `${scoreOption} - score settings`
        ),
      },
    ],
  };

  // Function to store, which tab is selected
  // const tabChangeClick = (button: string) => {
  //   setSelectedButton(button);
  // };

  // const handleRowData: MouseEventHandler<HTMLElement> = (e) => {
  //   const { parent, index, scoreattr, operation } = e.currentTarget.dataset; // Extract parent, attr, index, and subIndex
  //   if (!parent || !index || !scoreattr || !operation) return; // Handle missing data attributes

  //   // Set the row data to be deleted
  //   const rowData = {
  //     parent: parent.toString(),
  //     index: parseInt(index, 10),
  //     scoreattr: scoreattr,
  //     operation: operation,
  //   };
  //   // Store the row data to state variable
  //   setRowData(rowData);

  //   rowData.operation === "reset"
  //     ? handlePopupData("resetScore", rowData)
  //     : setPopupData({
  //         ...popupData,
  //         header: t("delete_score_header"),
  //         description: t("delete_score_description"),
  //         modalToggle: true,
  //         secondaryBtn: { text: "Yes, I'm Sure", value: "delete" },
  //         type: "delete",
  //       });
  // };

  const confirmScoreSave = () => {
    setPopupData({
      ...popupData,
      header: t("confirm_score_saving_header"),
      description: t("confirm_score_saving_description"),
      modalToggle: true,
      secondaryBtn: { text: "Yes, I'm Sure", value: "confirm" },
      type: "confirm",
    });
  };

  const resetScore = () => {
    setPopupData({
      ...popupData,
      header: t("reset_score_header"),
      description: t("reset_score_description"),
      modalToggle: true,
      secondaryBtn: { text: "Yes, I'm Sure", value: "reset" },
      type: "reset",
    });
  };

  // Function to handle input change
  const inputValidation = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const inputValue =
      (e.target as HTMLInputElement).value + e.key.replace(/[^0-9+-.]/g, "");
    const isFunctionalKey =
      /^(Delete|Backspace|Shift|Tab|Home|End|Ctrl|Alt|ArrowLeft|ArrowRight|ArrowUp|ArrowDown)$/;
    var length = inputValue.length;
    var isRequiredText = /^[0-9+-.]$/;
    var isText, status;

    switch (length) {
      case 1:
        isText = /^[+-]$/;
        break;
      case 2:
        isText = /^[+-]?[0-5]$/;
        break;
      case 3:
        isText = /^[+-]?[0-5]?[.]$/;
        break;
      case 4:
        isText =
          (e.target as HTMLInputElement).value === "+5." ||
            (e.target as HTMLInputElement).value === "-5."
            ? /^[+-]?[0-5]?[.]?[0]$/
            : /^[+-]?[0-5]?[.]?[0-9]$/;
        break;
      default:
        isText = /^[0-9+-.]$/;
        break;
    }
    status = length
      ? isRequiredText.test(e.key) && isText.test(inputValue)
      : false;
    if (!status && !isFunctionalKey.test(e.key)) {
      e.preventDefault();
      // alert("Kindly type in this format only +1.0 or -1.0");
      callChildFunction();
      return;
    }
  };

  // Function to handle input change
  const changeInputValue: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { parent, attr, index, subindex } = e.currentTarget.dataset; // Extract parent, attr, index, and subIndex
    if (!parent || !index || !attr) return; // Handle missing data attributes
    const parentString = parent.toString(); // Convert parent to string
    const attrString = attr;
    const indexNumber = parseInt(index, 10); // Parse index to number
    const subIndexNumber = subindex && parseInt(subindex, 10);
    var localVar = JSON.parse(JSON.stringify(scoreCardDataObj));

    if (localVar) {
      Object.entries(localVar).forEach(([key, value]: [string, any]) => {
        value.map((data: ScoreCardDataInterface) => {
          if (data.title === parentString) {
            data.cardData = data.cardData.map(
              (cardData: any, subIndex: number) => {
                if (indexNumber === subIndex) {
                  if (attrString === "typeScore") {
                    cardData.typeScore = e.currentTarget.value;
                  } else {
                    cardData?.scoreData?.attributes.forEach(
                      (finalData: any, sIndex: number) => {
                        if (sIndex === subIndexNumber) {
                          finalData.score = e.currentTarget.value;
                          return finalData;
                        }
                      }
                    );
                  }
                }
                return cardData; // Return the modified cardData
              }
            );
          }
          return data; // Return the modified data
        });
      });
    }
    setScoreCardDataObj(localVar);
  };

  const handleInputBlur = (event: FocusEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value.endsWith(".")) {
    }
  };

  // Function to get data from confirm popup
  const handlePopupData = async (data: any, rowdataParam: any = rowData) => {
    setPopupData({
      ...popupData,
      modalToggle: false,
    });

    if (data === false) {
      return;
    } else if (data === "reset") {
      setSelectedButton(selectedButton);
      setScoreCardDataObj(scoreCardDataTemp);
      setPassengerSelectedValues(SeditScoreData ? passengerSelectedValues : []);
      setFlightSelectedValues(SeditScoreData ? flightSelectedValues : []);
      scoreForm.setFieldsValue({
        title: SeditScoreData ? SeditScoreData?.[0]?.scoreTitle : "",
        dateRange: SeditScoreData ? [dayjs(SeditScoreData?.[0]?.startDate, "DD MMMM YYYY"), dayjs(SeditScoreData?.[0]?.endDate, "DD MMMM YYYY")] : "",
        // scoreCriteria: SeditScoreData ? SeditScoreData?.[0]?.scoreCriteria : undefined
      });
      setChecked(false);
      setApplied(false);
      // setBtnDisable(true);
      return;
    } else if (data === "confirm") {
      let listData = JSON.parse(JSON.stringify(scoreListData));
      let key: any;
      listData.forEach((data: any) => {
        if (data.key !== undefined && data.key !== "") {
          key = data.key
        }
      })

      let formValue = formSubmitValue;
      formValue.key = SeditScoreData ? SeditScoreData[0].key : Number(key) + 1;
      const updatedList = [
        ...listData.filter((score: any) => score.key !== formValue.key),
        formValue
      ];
      updatedList.sort((a: any, b: any) => a.key - b.key);

      try {
        const response = await postQueuePNRListService({
          service_name: "scoreList",
          data: updatedList,
        }).unwrap();
        var intervalSet = setInterval(() => {
          if (response?.responseCode === 0) {
            notification.success({
              message: `Score ${isCurrentPathEqual('editScoreSettings') ? "updated" : "created" } successfully`,
            });
            clearInterval(intervalSet);
            redirect("scoreList");
          }
        }, 1000);
      } catch (error: any) {
        console.error("Error:", error);
      }
      return;
    } else if (data === "resetScore" || rowdataParam.operation === "delete") {
      const parentString = rowdataParam.parent; // Convert parent to string
      const indexNumber = rowdataParam.index; // Parse index to number
      const operation = rowdataParam.operation;
      var localVar = JSON.parse(JSON.stringify(scoreCardDataObj));
      var localVarTemp = JSON.parse(JSON.stringify(scoreCardDataTemp));

      if (localVar && localVarTemp) {
        Object.entries(localVar).forEach(([key, value]: [string, any]) => {
          Object.entries(localVarTemp).forEach(
            ([tempKey, tempValue]: [string, any]) => {
              value.forEach((data: ScoreCardDataInterface) => {
                tempValue.forEach((tempData: ScoreCardDataInterface) => {
                  if (
                    data.title === parentString &&
                    tempData.title === parentString
                  ) {
                    tempData.cardData.forEach(
                      (tempCardData: any, tempSubIndex: number) => {
                        data.cardData = data.cardData.map(
                          (cardData: any, subIndex: number) => {
                            if (
                              indexNumber === subIndex &&
                              indexNumber === tempSubIndex
                            ) {
                              cardData = tempCardData;
                            }
                            return cardData; // Return the modified cardData
                          }
                        );
                      }
                    );
                  }
                });
              });
            }
          );
        });
      }
      if (operation === "delete") {
        var temp =
          parentString === "Passenger"
            ? JSON.parse(JSON.stringify(passengerSelectedValues))
            : JSON.parse(JSON.stringify(flightSelectedValues));
        var removedData = temp.filter((item: string) => {
          return item !== rowdataParam.scoreattr;
        });
        parentString === "Passenger"
          ? setPassengerSelectedValues(removedData)
          : setFlightSelectedValues(removedData);
        onChangeSelect(parentString, rowdataParam.scoreattr, localVar);
      } else {
        setScoreCardDataObj(localVar);
      }
    }
  };

  // Function to handle adding a new score attribute
  const handleAddScoreAttribute = (
    dataTitle: any,
    innerIndex: number,
    operation: string
  ) => {
    const updatedCardData: any = JSON.parse(JSON.stringify(scoreCardDataObj));
    const loopData =
      updatedCardData[dataTitle][0]["cardData"][innerIndex]["scoreData"][
      "attributes"
      ];
    if (operation === "add") {
      loopData.push({
        value: "",
        score: "",
      });
    } else {
      loopData.pop();
    }
    setScoreCardDataObj(updatedCardData);
  };

  const getFilteredOptions = (allOptions: any, selectedValues: any) => {
    return allOptions.filter(
      (option: any) => !selectedValues.includes(option.value)
    );
  };

  const [scoreForm] = Form.useForm();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const onFinish = (values: any) => {
    const formattedStartDate:any = values.dateRange
      ? dayjs(values.dateRange[0]).format("MMM DD, YYYY")
      : undefined;
    const formattedEndDate:any = values.dateRange
      ? dayjs(values.dateRange[1]).format("MMM DD, YYYY")
      : undefined;      

    setFormSubmitValue({
      scoreTitle: values.title,
      startDate: getDynamicDate(formattedStartDate, true),
      endDate: getDynamicDate(formattedEndDate, true),
      // scoreCriteria: values?.scoreCriteria,
      scoreSet: selectedButton,
      score: scoreCardDataObj[selectedButton],
    });
    confirmScoreSave();
  };

  const validateSelection = (_: any, value: any) => {
    if (!checked || !applied) {
      return Promise.reject(new Error("Please select and apply a criteria!"));
    }
    return Promise.resolve();
  };

  const formattedDates = 
            SeditScoreData?.[0]
              ? [ dayjs(getDynamicDate(SeditScoreData[0].startDate)), dayjs(getDynamicDate(SeditScoreData[0].endDate))] 
              : "";

  return (
    <>
      <div data-testid="ScoreSettings" className="cls-scoreSettings">
        {!scoreCardDataObj ? (
          <ScoreSettingsSkeleton />
        ) : (
          <>
            <DescriptionHeader data={headerProps} />
            {
              // Condition to show the tabs or not
              selectedButton !== "both" && (
                <Row className="cls-tabs-pills">
                  <Col sm={6} lg={6}>
                    {/* <Button
                      className={`cls-passenger-btn ${
                        selectedButton === "Passenger" ? "active" : ""
                      }`}
                      onClick={() => tabChangeClick("Passenger")}
                    >
                      {t("Passenger")}
                    </Button>
                    <Button
                      className={`cls-flight-btn ${
                        selectedButton === "Flight" ? "active" : ""
                      }`}
                      onClick={() => tabChangeClick("Flight")}
                    >
                      {t("Flight")}
                    </Button> */}
                  </Col>
                  <Col sm={18} md={15} lg={18} className="cls-match-container">
                    {matchData.map((countData) => (
                      <Text className={"cls-" + countData.class}>
                        <Text className="cls-mark"> </Text>
                        <Text className="cls-match">
                          {" "}
                          {t(countData.content)}{" "}
                        </Text>
                        <Text className="cls-match-count">
                          {" "}
                          {countData.count}{" "}
                        </Text>
                      </Text>
                    ))}
                  </Col>
                </Row>
              )
            }
            <Form
              form={scoreForm}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                title: SeditScoreData ? SeditScoreData?.[0]?.scoreTitle : "",
                dateRange: formattedDates
                // scoreCriteria: SeditScoreData ? SeditScoreData?.[0]?.scoreCriteria : undefined
              }}
            >
              {scoreCardDataObj &&
                Object.entries(scoreCardDataObj).map(([key, mainData]) =>
                  (mainData as any[])?.map(
                    (data: any, index: number) =>
                      (selectedButton === data.title ||
                        selectedButton === "both") && (
                        <Card key={index} className="cls-passenger-card">
                          <Row>
                            <Col span={6}>
                              <Form.Item
                                label="Title"
                                name="title"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please enter the title!",
                                  },
                                ]}
                              >
                                <Input
                                  size="large"
                                  placeholder="Enter title"
                                  maxLength={50}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={6} className="pl-4">
                              <Form.Item
                                label="Date range"
                                name="dateRange"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please select the date range!",
                                  },
                                ]}
                              >
                                <RangePicker
                                  format="MMM DD, YYYY"
                                  size="large"
                                />
                              </Form.Item>
                            </Col>
                            {/* <Col span={6} className="pl-4">
                              <Form.Item
                                label="Criteria"
                                name="scoreCriteria"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please select a criteria!",
                                  },
                                ]}
                              >
                                <Select
                                  placeholder="Select criteria"
                                  size="large"
                                >
                                  <Option value="time_change"> Time change </Option>
                                  <Option value="irops"> Irops </Option>
                                  <Option value="flight_cancelled"> Flight cancelled </Option>
                                  <Option value="terminal_change"> Terminal change </Option>
                                  <Option value="gate_change"> Gate change </Option>
                                  <Option value="airport_change"> Airport change </Option>
                                  <Option value="equipment_change"> Equipment change </Option>
                                  <Option value="bad_weather"> Bad weather </Option>
                                </Select>
                              </Form.Item>
                            </Col> */}
                          </Row>
                          <Row className="cls-passenger-content">
                            <Col sm={24}>
                              <Typography.Paragraph>
                                <Text className="Infi-Fd_15_Info"></Text>
                                {t(data.content)}
                              </Typography.Paragraph>
                            </Col>
                          </Row>
                          <Row>
                            <Col sm={6}>
                              <Form.Item
                                name="scoreAttributes"
                                rules={[{ validator: validateSelection }]}
                              >
                                <Select
                                  dropdownRender={() => (
                                    <Text className="cls-dropdown">
                                      {data?.scoreAttributes?.map(
                                        (option: any, index: number) => (
                                          <Checkbox
                                            className="cls-checkbox"
                                            key={option?.type}
                                            value={option?.type}
                                            checked={option?.selected}
                                            ref={(el) =>
                                              (inputRefs.current[index] = el?.input as HTMLInputElement)
                                            }
                                            onChange={() =>
                                              onChangeSelect(data?.title, option?.type)
                                            }
                                          >
                                            {option.type}
                                          </Checkbox>
                                        )
                                      )}
                                      <Button
                                        type="text"
                                        className="cls-score-apply mb-1"
                                        onClick={() => {
                                          applyChanges(data.title);
                                        }}
                                      >
                                        Apply
                                      </Button>
                                    </Text>
                                  )}
                                  style={{ width: 220 }}
                                  placeholder="Select an option"
                                  onDropdownVisibleChange={(visible) => setVisible(visible)}
                                  value={"Select score attribute"}
                                  size="large"
                                  className="cls-score-select"
                                  open={visible}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row
                            className={`cls-content-row mt-4 collapse-container ${isCollapsed ? "collapsed" : ""}`}
                          >
                            {data.cardData?.map(
                              (loopData: any, innerIndex: number) =>
                                (passengerSelectedValues.includes(
                                  loopData.typeTitle
                                ) ||
                                  flightSelectedValues.includes(
                                    loopData.typeTitle
                                  )) && (
                                  <Flex
                                    key={innerIndex}
                                    gap={20}
                                    className="cls-sector-row w-100"
                                  >
                                    <Col span={5}>
                                      <Space.Compact
                                        size="middle"
                                        className="cls-scoretype"
                                      >
                                        <Input
                                          key={loopData.typeTitle}
                                          addonBefore={loopData.typeTitle}
                                          placeholder="Score"
                                          variant="borderless"
                                          maxLength={4}
                                          data-parent={data.title}
                                          data-attr="typeScore"
                                          data-index={innerIndex}
                                          value={loopData?.typeScore}
                                          onKeyDown={(e) => inputValidation(e)}
                                          onChange={changeInputValue}
                                          onBlur={handleInputBlur}
                                        />
                                      </Space.Compact>
                                    </Col>
                                    <Flex
                                      className="cls-score-div"
                                      wrap
                                      gap={15}
                                      align="center"
                                    >
                                      {loopData?.scoreData?.attributes.map(
                                        (
                                          scoreData: any,
                                          selectIndex: number
                                        ) => {
                                          // Collect all selected values except the current one
                                          const selectedValues =
                                            loopData.scoreData.attributes
                                              .map((attr: any) => attr.value)
                                              .filter(
                                                (value: any, i: number) =>
                                                  i !== selectIndex
                                              );
                                          // Filter the options
                                          filteredOptions = getFilteredOptions(
                                            loopData?.scoreData?.options,
                                            selectedValues
                                          );
                                          return (
                                            <Space.Compact
                                              key={selectIndex}
                                              className="cls-select-input"
                                            >
                                              <Select
                                                size="large"
                                                value={
                                                  scoreData?.value || undefined
                                                }
                                                placeholder="Select attribute"
                                                options={filteredOptions}
                                                suffixIcon={
                                                  <Text className="Infi-Fd_06_DownArrow"></Text>
                                                }
                                                onChange={(newValue) => {
                                                  const updatedAttributes = [
                                                    ...loopData.scoreData
                                                      .attributes,
                                                  ];
                                                  updatedAttributes[
                                                    selectIndex
                                                  ].value = newValue;
                                                  const updatedData =
                                                    JSON.parse(
                                                      JSON.stringify(
                                                        scoreCardDataObj
                                                      )
                                                    );
                                                  // if (updatedData[data.title][0]?.cardData[innerIndex]?.scoreData?.attributes) {
                                                  //   updatedData[data.title][innerIndex].scoreData.attributes = updatedAttributes;
                                                  setScoreCardDataObj(updatedData);
                                                  // }
                                                }}
                                              />
                                              <Input
                                                placeholder="Score"
                                                className="cls-type-input"
                                                value={scoreData?.score}
                                                data-parent={data.title}
                                                data-attr="score"
                                                data-subindex={selectIndex}
                                                data-index={innerIndex}
                                                onKeyDown={(e) =>
                                                  inputValidation(e)
                                                }
                                                onChange={changeInputValue}
                                              />
                                            </Space.Compact>
                                          );
                                        }
                                      )}
                                      <Tooltip
                                        className="cls-cursor-pointer"
                                        title="Add score attribute"
                                      >
                                        <Text
                                          className={`cls-reset-icon ${loopData?.scoreData?.attributes?.length === loopData?.scoreData?.options?.length || filteredOptions?.length === 1 ? "cls-disabled no-events" : ""}`}
                                          onClick={() =>
                                            handleAddScoreAttribute(
                                              data.title,
                                              innerIndex,
                                              "add"
                                            )
                                          }
                                          data-operation="reset"
                                          data-parent={data.title}
                                          data-index={innerIndex}
                                          data-scoreattr={loopData.typeTitle}
                                        >
                                          <PlusCircleOutlined />
                                        </Text>
                                      </Tooltip>
                                      <Tooltip
                                        className="cls-cursor-pointer"
                                        title="Delete score attribute"
                                      >
                                        <Text
                                          className={`Infi-Fd_77_Garbage cls-delete-icon ${loopData?.scoreData?.attributes?.length === 1 ? "cls-disabled no-events" : ""}`}
                                          onClick={() =>
                                            handleAddScoreAttribute(
                                              data.title,
                                              innerIndex,
                                              "delete"
                                            )
                                          }
                                          data-operation="delete"
                                          data-parent={data.title}
                                          data-index={innerIndex}
                                          data-scoreattr={loopData.typeTitle}
                                        ></Text>
                                      </Tooltip>
                                    </Flex>
                                  </Flex>
                                )
                            )}
                          </Row>
                        </Card>
                      )
                  )
                )}
              <Row>
                <Col sm={24} className="cls-footer-container">
                  <Button
                    className="cls-reset cls-secondary-btn"
                    // disabled={btnDisable}
                    onClick={() => {
                      resetScore();
                    }}
                  >
                    {t("reset")}
                  </Button>
                  <Form.Item className="d-iblock">
                    <Button
                      className="cls-saveScore cls-primary-btn"
                      // disabled={btnDisable}
                      // onClick={() => {
                      //   confirmScoreSave();
                      // }}
                      htmlType="submit"
                    >
                      {t("save_score")}
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <ConfirmModalPopup onData={handlePopupData} props={popupData} />
            <Toastr data={toastrPropsData} ref={childRef} />
          </>
        )}
      </div>
    </>
  );
};

export default ScoreSettings;
