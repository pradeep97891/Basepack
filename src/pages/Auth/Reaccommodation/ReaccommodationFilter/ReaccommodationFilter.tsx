import '../../../../components/PersonalizedFilter/PersonalizedFilter.scss';
import {
  Button,
  Card,
  Col,
  Divider,
  Dropdown,
  Form,
  Row,
  Select,
  Space,
  Tooltip,
  Typography,
  Flex,
  Switch,
} from "antd";
import { useEffect, useState } from "react";
import { FdFilter } from "../../../../components/Icons/Icons";
import { useAppSelector } from "@/hooks/App.hook";
import { resetAppliedFilter } from "@/stores/General.store";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
const { Text } = Typography;

const ReaccommodationFilter = ({
  filterData,
  sendFilterHandler
}: any) => {
  const [open, setOpen] = useState(false);
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [filterForm] = Form.useForm();
  const { appliedFilters } = useAppSelector((state) => state.GeneralReducer);
  /**
   * Toggles the dropdown's open state when a user interacts with it.
   *
   * @param {boolean} flag - Represents whether the dropdown should be opened or closed.
   */
  const handleOpenChange = (flag: boolean) => {
    if (flag !== open) setOpen(flag);
  };  

  /* Remove handler */
  const removeFilter = (key: string) => {
    filterForm.setFieldValue(["filter", key], undefined);
    const newAppliedFilter: any = { ...appliedFilters };
    delete newAppliedFilter?.[key];
    dispatch(resetAppliedFilter(newAppliedFilter));
    filterForm.submit();
  };

  const [appliedFilterKeys, setAppliedFilterKeys] = useState<string[]>([]);

  useEffect(() => {
    if (appliedFilters && Object.keys(appliedFilters).length) {
      setAppliedFilterKeys(Object.keys(appliedFilters));
    } else {
      setAppliedFilterKeys([]);
    }
  }, [appliedFilters]);

  /* Reset handler */
  const resetFilters = () => {
    filterForm.resetFields();
  };


  const filterHandler = (
    values: Record<string, any>
  ) => {
    const formValues = filterForm.getFieldsValue();
    const isValid = formValues && !!Object.values(formValues["filter"]).filter((v: any) => v)?.length;
    if (isValid) {
      dispatch(
        resetAppliedFilter(
          Object.entries(formValues["filter"])
            .filter(([, value]) => value !== undefined)
            .reduce(
              (acc, [key, value]) => {
                acc[key] = value === "TMRW" 
                            ? "Next 48 Hrs"
                            : value === "T" 
                              ? "Today"
                              : value === "DAT" 
                                ? "Next 72 Hrs"
                                : value;
                return acc;
              },
              {} as Record<string, any>
            )
        )
      );
    }
    
    sendFilterHandler(filterForm.getFieldsValue());
    setOpen(false);
  };

  return (
    <Row className="cls-personalized-filter" gutter={40} justify="end">
      <Col>
        <Flex align="center" justify="center" className="cls-applied-filters">
          <Space>
            {appliedFilterKeys
              .slice(0, 2)
              ?.map((f: string, index: number) => {
                return (
                  <Card className="cls-applied-filter-card" key={index}>
                    <Text>{(appliedFilters as any)?.[f]}</Text>
                    <Button type="link" className="px-0 py-0">
                      <Text
                        className="Infi-Fd_82_CloseMark fs-10 cls-close-mark ml-2"
                        onClick={() => removeFilter(f)}
                      ></Text>
                    </Button>
                  </Card>
                );
              })}
            {appliedFilterKeys?.length > 2 &&
              `+ ${appliedFilterKeys?.length - 2}`}
          </Space>
        </Flex>
      </Col>
      <Col className="cls-filter-dropdown">
        <Dropdown
          className="mr-2"
          // menu={{ items }}
          dropdownRender={(menu) => (
            <Card className="cls-dropdown" bordered={false} style={{minWidth: 247}}>
              <Form
                form={filterForm}
                layout="vertical"
                onFinish={filterHandler}
              >
                <Flex
                  align="center"
                  justify="space-between"
                  className="cls-filter-header py-2"
                >
                  <Text>
                    <Text title="Go back" className="Infi-Fd_10_ArrowRight cls-goBack" onClick={()=>setOpen(false)}></Text>
                    <Text className="fs-16 f-med">Filters</Text>
                  </Text>
                  
                  <Button
                    type="link"
                    className="px-0 py-0 fs-13 f-reg p-clr"
                    onClick={resetFilters}
                  >
                    Reset All
                  </Button>
                </Flex>
                <Divider className="my-0" />
                <Flex vertical gap={8} className="cls-filters pt-2 py-3">
                  {filterData.map((filter: any) => (
                      <Form.Item
                        name={["filter", filter.key]}
                        key={filter.key}
                        label={filter.label}
                      >
                        <Select options={filter?.option} placeholder="Select" />
                      </Form.Item>
                    )
                  )}
                  <Flex align="middle">
                      <Form.Item
                        className="cls-switch"
                        name="partnerFlights"
                        valuePropName="checked"
                        key="partnerFlights"
                        labelAlign="right"
                      >
                        <Switch defaultValue={false} />
                      </Form.Item>
                      <Text className='d-iblock pl-2 fs-15 f-reg' style={{paddingTop:7}}>Partner flights</Text>
                  </Flex>

                  
                  <Button
                    htmlType="submit"
                    type="default"
                    className="mt-4 w-100"
                  >
                    Apply
                  </Button>
                </Flex>
              </Form>
            </Card>
          )}
          open={open}
          onOpenChange={handleOpenChange}
          trigger={["click"]}
          placement="bottom"
        >
          <Tooltip title={t("add_filter")}>
            <Button type="primary" className="px-1">
              <FdFilter />
            </Button>
          </Tooltip>
        </Dropdown>
      </Col>
    </Row>
  );
};

export default ReaccommodationFilter;
