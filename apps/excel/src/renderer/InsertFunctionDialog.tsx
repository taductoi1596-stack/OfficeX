import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { Button } from '@officex/ui';
import { CommandDispatcher } from './CommandDispatcher';

interface FunctionDef {
  name: string;
  signature: string;
  description: string;
  category: string;
}

const FUNCTIONS: FunctionDef[] = [
  // === TÀI CHÍNH ===
  { name: 'ACCRINT', signature: 'ACCRINT(issue; first_interest; settlement; rate; par; frequency; [basis]; [calc_method])', description: 'Trả về lãi suất cộng dồn cho chứng khoán trả lãi định kỳ.', category: 'Tài chính' },
  { name: 'ACCRINTM', signature: 'ACCRINTM(issue; settlement; rate; par; [basis])', description: 'Trả về lãi suất cộng dồn cho chứng khoán trả lãi khi đáo hạn.', category: 'Tài chính' },
  { name: 'AMORDEGRC', signature: 'AMORDEGRC(cost; date_purchased; first_period; salvage; period; rate; [basis])', description: 'Trả về khấu hao cho mỗi kỳ kế toán, sử dụng hệ số khấu hao (Pháp).', category: 'Tài chính' },
  { name: 'AMORLINC', signature: 'AMORLINC(cost; date_purchased; first_period; salvage; period; rate; [basis])', description: 'Trả về khấu hao cho mỗi kỳ kế toán bằng phương pháp đường thẳng (Pháp).', category: 'Tài chính' },
  { name: 'COUPDAYBS', signature: 'COUPDAYBS(settlement; maturity; frequency; [basis])', description: 'Trả về số ngày từ đầu kỳ phiếu lãi đến ngày thanh toán.', category: 'Tài chính' },
  { name: 'COUPDAYS', signature: 'COUPDAYS(settlement; maturity; frequency; [basis])', description: 'Trả về số ngày trong kỳ phiếu lãi chứa ngày thanh toán.', category: 'Tài chính' },
  { name: 'COUPDAYSNC', signature: 'COUPDAYSNC(settlement; maturity; frequency; [basis])', description: 'Trả về số ngày từ ngày thanh toán đến ngày cu-pôn tiếp theo.', category: 'Tài chính' },
  { name: 'COUPNCD', signature: 'COUPNCD(settlement; maturity; frequency; [basis])', description: 'Trả về ngày cu-pôn tiếp theo sau ngày thanh toán.', category: 'Tài chính' },
  { name: 'COUPNUM', signature: 'COUPNUM(settlement; maturity; frequency; [basis])', description: 'Trả về số cu-pôn phải trả giữa ngày thanh toán và ngày đáo hạn.', category: 'Tài chính' },
  { name: 'COUPPCD', signature: 'COUPPCD(settlement; maturity; frequency; [basis])', description: 'Trả về ngày cu-pôn trước ngày thanh toán.', category: 'Tài chính' },
  { name: 'CUMIPMT', signature: 'CUMIPMT(rate; nper; pv; start_period; end_period; type)', description: 'Trả về lãi gộp được trả cho khoản vay giữa hai kỳ.', category: 'Tài chính' },
  { name: 'CUMPRINC', signature: 'CUMPRINC(rate; nper; pv; start_period; end_period; type)', description: 'Trả về tiền gốc cộng dồn phải trả cho khoản vay giữa hai chu kỳ.', category: 'Tài chính' },
  { name: 'DB', signature: 'DB(cost; salvage; life; period; [month])', description: 'Trả về khấu hao của tài sản trong kỳ xác định bằng phương pháp số dư giảm dần cố định.', category: 'Tài chính' },
  { name: 'DDB', signature: 'DDB(cost; salvage; life; period; [factor])', description: 'Trả về khấu hao của tài sản trong kỳ xác định bằng phương pháp số dư giảm dần kép.', category: 'Tài chính' },
  { name: 'DISC', signature: 'DISC(settlement; maturity; pr; redemption; [basis])', description: 'Trả về tỷ lệ chiết khấu cho một chứng khoán.', category: 'Tài chính' },
  { name: 'DOLLARDE', signature: 'DOLLARDE(fractional_dollar; fraction)', description: 'Chuyển đổi giá đô-la, thể hiện như phân số, sang giá đô-la, thể hiện như số thập phân.', category: 'Tài chính' },
  { name: 'DOLLARFR', signature: 'DOLLARFR(decimal_dollar; fraction)', description: 'Chuyển đổi giá đô-la, thể hiện như số thập phân, sang giá đô-la, thể hiện như phân số.', category: 'Tài chính' },
  { name: 'DURATION', signature: 'DURATION(settlement; maturity; coupon; yld; frequency; [basis])', description: 'Trả về thời gian đáo hạn Macaulay hàng năm cho chứng khoán với lãi suất định kỳ.', category: 'Tài chính' },
  { name: 'EFFECT', signature: 'EFFECT(nominal_rate; npery)', description: 'Trả về lãi suất hàng năm thực tế.', category: 'Tài chính' },
  { name: 'FV', signature: 'FV(rate; nper; pmt; [pv]; [type])', description: 'Trả về giá trị tương lai của một khoản đầu tư.', category: 'Tài chính' },
  { name: 'FVSCHEDULE', signature: 'FVSCHEDULE(principal; schedule)', description: 'Trả về giá trị tương lai của khoản vốn ban đầu sau khi áp dụng một dãy lãi suất ghép.', category: 'Tài chính' },
  { name: 'INTRATE', signature: 'INTRATE(settlement; maturity; investment; redemption; [basis])', description: 'Trả về lãi suất cho một chứng khoán được đầu tư toàn bộ.', category: 'Tài chính' },
  { name: 'IPMT', signature: 'IPMT(rate; per; nper; pv; [fv]; [type])', description: 'Trả về khoản thanh toán tiền lãi cho một khoản đầu tư trong kỳ đã cho.', category: 'Tài chính' },
  { name: 'IRR', signature: 'IRR(values; [guess])', description: 'Trả về tỷ suất hoàn vốn nội bộ cho một dãy các dòng tiền.', category: 'Tài chính' },
  { name: 'ISPMT', signature: 'ISPMT(rate; per; nper; pv)', description: 'Tính tiền lãi trả trong kỳ cụ thể của một khoản đầu tư.', category: 'Tài chính' },
  { name: 'MDURATION', signature: 'MDURATION(settlement; maturity; coupon; yld; frequency; [basis])', description: 'Trả về thời gian đáo hạn Macaulay được điều chỉnh cho chứng khoán.', category: 'Tài chính' },
  { name: 'MIRR', signature: 'MIRR(values; finance_rate; reinvest_rate)', description: 'Trả về tỷ lệ hoàn vốn nội bộ khi các dòng tiền dương và âm được tài trợ ở các tỷ lệ khác nhau.', category: 'Tài chính' },
  { name: 'NOMINAL', signature: 'NOMINAL(effect_rate; npery)', description: 'Trả về lãi suất danh nghĩa hàng năm.', category: 'Tài chính' },
  { name: 'NPER', signature: 'NPER(rate; pmt; pv; [fv]; [type])', description: 'Trả về số kỳ của một khoản đầu tư.', category: 'Tài chính' },
  { name: 'NPV', signature: 'NPV(rate; value1; [value2]; ...)', description: 'Trả về giá trị hiện tại ròng của một khoản đầu tư dựa trên tỷ lệ chiết khấu và một dãy các khoản thanh toán trong tương lai.', category: 'Tài chính' },
  { name: 'ODDFPRICE', signature: 'ODDFPRICE(settlement; maturity; issue; first_coupon; rate; yld; redemption; frequency; [basis])', description: 'Trả về giá trên mỗi $100 mệnh giá của chứng khoán có kỳ đầu lẻ.', category: 'Tài chính' },
  { name: 'ODDFYIELD', signature: 'ODDFYIELD(settlement; maturity; issue; first_coupon; rate; pr; redemption; frequency; [basis])', description: 'Trả về lợi tức của chứng khoán có kỳ đầu lẻ.', category: 'Tài chính' },
  { name: 'ODDLPRICE', signature: 'ODDLPRICE(settlement; maturity; last_interest; rate; yld; redemption; frequency; [basis])', description: 'Trả về giá trên mỗi $100 mệnh giá của chứng khoán có kỳ cuối lẻ.', category: 'Tài chính' },
  { name: 'ODDLYIELD', signature: 'ODDLYIELD(settlement; maturity; last_interest; rate; pr; redemption; frequency; [basis])', description: 'Trả về lợi tức của chứng khoán có kỳ cuối lẻ.', category: 'Tài chính' },
  { name: 'PDURATION', signature: 'PDURATION(rate; pv; fv)', description: 'Trả về số kỳ cần thiết để đầu tư đạt giá trị xác định.', category: 'Tài chính' },
  { name: 'PMT', signature: 'PMT(rate; nper; pv; [fv]; [type])', description: 'Trả về khoản thanh toán định kỳ cho một khoản vay.', category: 'Tài chính' },
  { name: 'PPMT', signature: 'PPMT(rate; per; nper; pv; [fv]; [type])', description: 'Trả về khoản thanh toán tiền gốc của khoản đầu tư trong kỳ đã cho.', category: 'Tài chính' },
  { name: 'PRICE', signature: 'PRICE(settlement; maturity; rate; yld; redemption; frequency; [basis])', description: 'Trả về giá trên mỗi $100 mệnh giá của chứng khoán trả lãi định kỳ.', category: 'Tài chính' },
  { name: 'PRICEDISC', signature: 'PRICEDISC(settlement; maturity; discount; redemption; [basis])', description: 'Trả về giá trên mỗi $100 mệnh giá của chứng khoán chiết khấu.', category: 'Tài chính' },
  { name: 'PRICEMAT', signature: 'PRICEMAT(settlement; maturity; issue; rate; yld; [basis])', description: 'Trả về giá trên mỗi $100 mệnh giá của chứng khoán trả lãi khi đáo hạn.', category: 'Tài chính' },
  { name: 'PV', signature: 'PV(rate; nper; pmt; [fv]; [type])', description: 'Trả về giá trị hiện tại của một khoản đầu tư.', category: 'Tài chính' },
  { name: 'RATE', signature: 'RATE(nper; pmt; pv; [fv]; [type]; [guess])', description: 'Trả về lãi suất mỗi kỳ của một khoản vay hoặc đầu tư.', category: 'Tài chính' },
  { name: 'RECEIVED', signature: 'RECEIVED(settlement; maturity; investment; discount; [basis])', description: 'Trả về số tiền nhận được khi đáo hạn cho một chứng khoán được đầu tư toàn bộ.', category: 'Tài chính' },
  { name: 'RRI', signature: 'RRI(nper; pv; fv)', description: 'Trả về lãi suất tương đương cho sự tăng trưởng của một khoản đầu tư.', category: 'Tài chính' },
  { name: 'SLN', signature: 'SLN(cost; salvage; life)', description: 'Trả về khấu hao theo đường thẳng của một tài sản trong một kỳ.', category: 'Tài chính' },
  { name: 'SYD', signature: 'SYD(cost; salvage; life; per)', description: 'Trả về khấu hao theo số năm tổng hợp của tài sản trong một kỳ xác định.', category: 'Tài chính' },
  { name: 'TBILLEQ', signature: 'TBILLEQ(settlement; maturity; discount)', description: 'Trả về lợi tức tương đương trái phiếu kho bạc.', category: 'Tài chính' },
  { name: 'TBILLPRICE', signature: 'TBILLPRICE(settlement; maturity; discount)', description: 'Trả về giá trên mỗi $100 mệnh giá của tín phiếu kho bạc.', category: 'Tài chính' },
  { name: 'TBILLYIELD', signature: 'TBILLYIELD(settlement; maturity; pr)', description: 'Trả về lợi tức của tín phiếu kho bạc.', category: 'Tài chính' },
  { name: 'VDB', signature: 'VDB(cost; salvage; life; start_period; end_period; [factor]; [no_switch])', description: 'Trả về khấu hao của tài sản trong khoảng thời gian xác định bằng phương pháp số dư giảm dần kép.', category: 'Tài chính' },
  { name: 'XIRR', signature: 'XIRR(values; dates; [guess])', description: 'Trả về tỷ lệ hoàn vốn nội bộ cho một lịch trình dòng tiền không nhất thiết định kỳ.', category: 'Tài chính' },
  { name: 'XNPV', signature: 'XNPV(rate; values; dates)', description: 'Trả về giá trị hiện tại ròng cho một lịch trình dòng tiền không nhất thiết định kỳ.', category: 'Tài chính' },
  { name: 'YIELD', signature: 'YIELD(settlement; maturity; rate; pr; redemption; frequency; [basis])', description: 'Trả về lợi tức của chứng khoán trả lãi suất định kỳ.', category: 'Tài chính' },
  { name: 'YIELDDISC', signature: 'YIELDDISC(settlement; maturity; pr; redemption; [basis])', description: 'Trả về lợi tức hàng năm của chứng khoán chiết khấu.', category: 'Tài chính' },
  { name: 'YIELDMAT', signature: 'YIELDMAT(settlement; maturity; issue; rate; pr; [basis])', description: 'Trả về lợi tức hàng năm của chứng khoán trả lãi khi đáo hạn.', category: 'Tài chính' },

  // === TOÁN LƯỢNG GIÁC ===
  // -- Cơ bản --
  { name: 'ABS', signature: 'ABS(number)', description: 'Trả về giá trị tuyệt đối của một số.', category: 'Toán Lượng giác' },
  { name: 'SIGN', signature: 'SIGN(number)', description: 'Trả về dấu của một số: 1 nếu dương, 0 nếu bằng 0, -1 nếu âm.', category: 'Toán Lượng giác' },
  { name: 'SUM', signature: 'SUM(number1; [number2]; ...)', description: 'Cộng tất cả các số trong một dải ô.', category: 'Toán Lượng giác' },
  { name: 'SUMIF', signature: 'SUMIF(range; criteria; [sum_range])', description: 'Tính tổng các ô thỏa mãn điều kiện đã cho.', category: 'Toán Lượng giác' },
  { name: 'SUMPRODUCT', signature: 'SUMPRODUCT(array1; [array2]; ...)', description: 'Nhân các phần tử tương ứng trong mảng và trả về tổng các tích đó.', category: 'Toán Lượng giác' },
  { name: 'SUMSQ', signature: 'SUMSQ(number1; [number2]; ...)', description: 'Trả về tổng bình phương của các đối số.', category: 'Toán Lượng giác' },
  { name: 'PRODUCT', signature: 'PRODUCT(number1; [number2]; ...)', description: 'Nhân tất cả các số đã cho làm đối số và trả về tích.', category: 'Toán Lượng giác' },
  { name: 'SUBTOTAL', signature: 'SUBTOTAL(function_num; ref1; [ref2]; ...)', description: 'Trả về tổng phụ trong danh sách hoặc cơ sở dữ liệu.', category: 'Toán Lượng giác' },
  { name: 'AGGREGATE', signature: 'AGGREGATE(function_num; options; ref1; ...)', description: 'Trả về một tổng hợp trong danh sách hoặc cơ sở dữ liệu.', category: 'Toán Lượng giác' },
  // -- Làm tròn --
  { name: 'ROUND', signature: 'ROUND(number; num_digits)', description: 'Làm tròn một số đến số chữ số xác định.', category: 'Toán Lượng giác' },
  { name: 'ROUNDUP', signature: 'ROUNDUP(number; num_digits)', description: 'Làm tròn một số lên, ra xa số 0.', category: 'Toán Lượng giác' },
  { name: 'ROUNDDOWN', signature: 'ROUNDDOWN(number; num_digits)', description: 'Làm tròn xuống, về phía số 0.', category: 'Toán Lượng giác' },
  { name: 'MROUND', signature: 'MROUND(number; multiple)', description: 'Trả về số được làm tròn đến bội số mong muốn.', category: 'Toán Lượng giác' },
  { name: 'CEILING', signature: 'CEILING(number; significance)', description: 'Làm tròn số lên đến bội số có nghĩa gần nhất.', category: 'Toán Lượng giác' },
  { name: 'CEILING.MATH', signature: 'CEILING.MATH(number; [significance]; [mode])', description: 'Làm tròn số lên đến số nguyên hoặc bội số có nghĩa gần nhất.', category: 'Toán Lượng giác' },
  { name: 'CEILING.PRECISE', signature: 'CEILING.PRECISE(number; [significance])', description: 'Làm tròn số lên đến số nguyên hoặc bội số có nghĩa gần nhất.', category: 'Toán Lượng giác' },
  { name: 'FLOOR', signature: 'FLOOR(number; significance)', description: 'Làm tròn xuống số 0, đến bội số có nghĩa gần nhất.', category: 'Toán Lượng giác' },
  { name: 'FLOOR.MATH', signature: 'FLOOR.MATH(number; [significance]; [mode])', description: 'Làm tròn số xuống đến số nguyên hoặc đến bội số có nghĩa gần nhất.', category: 'Toán Lượng giác' },
  { name: 'FLOOR.PRECISE', signature: 'FLOOR.PRECISE(number; [significance])', description: 'Làm tròn số xuống đến số nguyên hoặc đến bội số có nghĩa gần nhất.', category: 'Toán Lượng giác' },
  { name: 'INT', signature: 'INT(number)', description: 'Làm tròn một số xuống số nguyên gần nhất.', category: 'Toán Lượng giác' },
  { name: 'TRUNC', signature: 'TRUNC(number; [num_digits])', description: 'Cắt bỏ phần thập phân của một số, trả về phần nguyên.', category: 'Toán Lượng giác' },
  { name: 'EVEN', signature: 'EVEN(number)', description: 'Làm tròn số lên đến số nguyên chẵn gần nhất.', category: 'Toán Lượng giác' },
  { name: 'ODD', signature: 'ODD(number)', description: 'Làm tròn số lên đến số nguyên lẻ gần nhất.', category: 'Toán Lượng giác' },
  // -- Phép tính --
  { name: 'MOD', signature: 'MOD(number; divisor)', description: 'Trả về phần dư sau khi chia một số cho ước số.', category: 'Toán Lượng giác' },
  { name: 'QUOTIENT', signature: 'QUOTIENT(numerator; denominator)', description: 'Trả về phần nguyên của phép chia.', category: 'Toán Lượng giác' },
  { name: 'POWER', signature: 'POWER(number; power)', description: 'Trả về kết quả của một số được lũy thừa.', category: 'Toán Lượng giác' },
  { name: 'SQRT', signature: 'SQRT(number)', description: 'Trả về căn bậc hai dương của một số.', category: 'Toán Lượng giác' },
  { name: 'SQRTPI', signature: 'SQRTPI(number)', description: 'Trả về căn bậc hai của (number * pi).', category: 'Toán Lượng giác' },
  { name: 'PI', signature: 'PI()', description: 'Trả về giá trị của Pi (3.14159...).', category: 'Toán Lượng giác' },
  { name: 'EXP', signature: 'EXP(number)', description: 'Trả về e lũy thừa của số đã cho.', category: 'Toán Lượng giác' },
  { name: 'LN', signature: 'LN(number)', description: 'Trả về logarithm tự nhiên của một số.', category: 'Toán Lượng giác' },
  { name: 'LOG', signature: 'LOG(number; [base])', description: 'Trả về logarithm của một số theo cơ số đã chỉ định.', category: 'Toán Lượng giác' },
  { name: 'LOG10', signature: 'LOG10(number)', description: 'Trả về logarithm cơ số 10 của một số.', category: 'Toán Lượng giác' },
  // -- Lượng giác --
  { name: 'SIN', signature: 'SIN(number)', description: 'Trả về sin của góc đã cho (đơn vị radian).', category: 'Toán Lượng giác' },
  { name: 'COS', signature: 'COS(number)', description: 'Trả về cosin của góc đã cho (đơn vị radian).', category: 'Toán Lượng giác' },
  { name: 'TAN', signature: 'TAN(number)', description: 'Trả về tang của góc đã cho (đơn vị radian).', category: 'Toán Lượng giác' },
  { name: 'ASIN', signature: 'ASIN(number)', description: 'Trả về arcsine (sin nghịch đảo) của một số (radian).', category: 'Toán Lượng giác' },
  { name: 'ACOS', signature: 'ACOS(number)', description: 'Trả về arccosine (cosin nghịch đảo) của một số (radian).', category: 'Toán Lượng giác' },
  { name: 'ATAN', signature: 'ATAN(number)', description: 'Trả về arctangent (tang nghịch đảo) của một số (radian).', category: 'Toán Lượng giác' },
  { name: 'ATAN2', signature: 'ATAN2(x_num; y_num)', description: 'Trả về arctangent của tọa độ x và y đã chỉ định.', category: 'Toán Lượng giác' },
  { name: 'ACOT', signature: 'ACOT(number)', description: 'Trả về arccotangent của một số (radian).', category: 'Toán Lượng giác' },
  { name: 'SEC', signature: 'SEC(number)', description: 'Trả về giá trị secant của một góc (radian).', category: 'Toán Lượng giác' },
  { name: 'CSC', signature: 'CSC(number)', description: 'Trả về giá trị cosecant của một góc (radian).', category: 'Toán Lượng giác' },
  { name: 'COT', signature: 'COT(number)', description: 'Trả về giá trị cotangent của một góc (radian).', category: 'Toán Lượng giác' },
  { name: 'DEGREES', signature: 'DEGREES(angle)', description: 'Chuyển đổi radian thành độ.', category: 'Toán Lượng giác' },
  { name: 'RADIANS', signature: 'RADIANS(angle)', description: 'Chuyển đổi độ thành radian.', category: 'Toán Lượng giác' },
  // -- Hyperbol --
  { name: 'SINH', signature: 'SINH(number)', description: 'Trả về sin hyperbol của một số.', category: 'Toán Lượng giác' },
  { name: 'COSH', signature: 'COSH(number)', description: 'Trả về cosin hyperbol của một số.', category: 'Toán Lượng giác' },
  { name: 'TANH', signature: 'TANH(number)', description: 'Trả về tang hyperbol của một số.', category: 'Toán Lượng giác' },
  { name: 'ASINH', signature: 'ASINH(number)', description: 'Trả về arcsin hyperbol nghịch đảo của một số.', category: 'Toán Lượng giác' },
  { name: 'ACOSH', signature: 'ACOSH(number)', description: 'Trả về arccosin hyperbol nghịch đảo của một số.', category: 'Toán Lượng giác' },
  { name: 'ATANH', signature: 'ATANH(number)', description: 'Trả về arctang hyperbol nghịch đảo của một số.', category: 'Toán Lượng giác' },
  { name: 'SECH', signature: 'SECH(number)', description: 'Trả về giá trị secant hyperbol của một góc.', category: 'Toán Lượng giác' },
  { name: 'CSCH', signature: 'CSCH(number)', description: 'Trả về giá trị cosecant hyperbol của một góc.', category: 'Toán Lượng giác' },
  { name: 'COTH', signature: 'COTH(number)', description: 'Trả về giá trị cotangent hyperbol của một góc.', category: 'Toán Lượng giác' },
  { name: 'ACOTH', signature: 'ACOTH(number)', description: 'Trả về arccotangent hyperbol nghịch đảo của một số.', category: 'Toán Lượng giác' },
  // -- Tổ hợp / Giai thừa --
  { name: 'FACT', signature: 'FACT(number)', description: 'Trả về giai thừa của một số.', category: 'Toán Lượng giác' },
  { name: 'FACTDOUBLE', signature: 'FACTDOUBLE(number)', description: 'Trả về giai thừa kép của một số.', category: 'Toán Lượng giác' },
  { name: 'COMBIN', signature: 'COMBIN(number; number_chosen)', description: 'Trả về số lượng tổ hợp cho số đối tượng đã cho.', category: 'Toán Lượng giác' },
  { name: 'COMBINA', signature: 'COMBINA(number; number_chosen)', description: 'Trả về số tổ hợp (có lặp) cho số đối tượng đã cho.', category: 'Toán Lượng giác' },
  { name: 'PERMUT', signature: 'PERMUT(number; number_chosen)', description: 'Trả về số hoán vị cho một số đối tượng đã chọn.', category: 'Toán Lượng giác' },
  { name: 'PERMUTATIONA', signature: 'PERMUTATIONA(number; number_chosen)', description: 'Trả về số hoán vị cho số đối tượng (có lặp).', category: 'Toán Lượng giác' },
  { name: 'MULTINOMIAL', signature: 'MULTINOMIAL(number1; [number2]; ...)', description: 'Trả về đa thức của một tập hợp các số.', category: 'Toán Lượng giác' },
  { name: 'GCD', signature: 'GCD(number1; [number2]; ...)', description: 'Trả về ước số chung lớn nhất.', category: 'Toán Lượng giác' },
  { name: 'LCM', signature: 'LCM(number1; [number2]; ...)', description: 'Trả về bội số chung nhỏ nhất.', category: 'Toán Lượng giác' },
  // -- Ngẫu nhiên --
  { name: 'RAND', signature: 'RAND()', description: 'Trả về một số ngẫu nhiên giữa 0 và 1.', category: 'Toán Lượng giác' },
  { name: 'RANDBETWEEN', signature: 'RANDBETWEEN(bottom; top)', description: 'Trả về một số nguyên ngẫu nhiên trong khoảng đã xác định.', category: 'Toán Lượng giác' },
  { name: 'RANDARRAY', signature: 'RANDARRAY([rows]; [cols]; [min]; [max]; [whole_number])', description: 'Trả về mảng số ngẫu nhiên.', category: 'Toán Lượng giác' },
  // -- Số La Mã / Số hệ cơ số --
  { name: 'ROMAN', signature: 'ROMAN(number; [form])', description: 'Chuyển đổi chữ số Ả-rập thành chữ số La-mã dưới dạng văn bản.', category: 'Toán Lượng giác' },
  { name: 'ARABIC', signature: 'ARABIC(text)', description: 'Chuyển đổi chữ số La-mã thành số Ả-rập.', category: 'Toán Lượng giác' },
  { name: 'BASE', signature: 'BASE(number; radix; [min_length])', description: 'Chuyển đổi một số thành dạng biểu diễn văn bản với cơ số cho sẵn.', category: 'Toán Lượng giác' },
  { name: 'DECIMAL', signature: 'DECIMAL(text; radix)', description: 'Chuyển đổi biểu diễn văn bản của số trong cơ số cho sẵn thành số thập phân.', category: 'Toán Lượng giác' },
  // -- Ma trận --
  { name: 'MMULT', signature: 'MMULT(array1; array2)', description: 'Trả về tích ma trận của hai mảng.', category: 'Toán Lượng giác' },
  { name: 'MDETERM', signature: 'MDETERM(array)', description: 'Trả về định thức ma trận của một mảng.', category: 'Toán Lượng giác' },
  { name: 'MINVERSE', signature: 'MINVERSE(array)', description: 'Trả về ma trận nghịch đảo của một mảng.', category: 'Toán Lượng giác' },
  { name: 'TRANSPOSE', signature: 'TRANSPOSE(array)', description: 'Trả về mảng được chuyển vị (hoán vị hàng-cột).', category: 'Toán Lượng giác' },
  { name: 'SEQUENCE', signature: 'SEQUENCE(rows; [cols]; [start]; [step])', description: 'Tạo dãy số liên tiếp trong mảng.', category: 'Toán Lượng giác' },
  { name: 'SERIESSUM', signature: 'SERIESSUM(x; n; m; coefficients)', description: 'Trả về tổng của chuỗi lũy thừa.', category: 'Toán Lượng giác' },

  // === THỐNG KÊ ===
  { name: 'AVERAGE', signature: 'AVERAGE(number1; [number2]; ...)', description: 'Trả về trung bình cộng của các đối số.', category: 'Thống kê' },
  { name: 'AVERAGEA', signature: 'AVERAGEA(value1; [value2]; ...)', description: 'Trả về trung bình (kể cả văn bản và giá trị lô-gic).', category: 'Thống kê' },
  { name: 'MAX', signature: 'MAX(number1; [number2]; ...)', description: 'Trả về giá trị lớn nhất trong một tập giá trị.', category: 'Thống kê' },
  { name: 'MAXA', signature: 'MAXA(value1; [value2]; ...)', description: 'Trả về giá trị lớn nhất (kể cả văn bản và lô-gic).', category: 'Thống kê' },
  { name: 'MIN', signature: 'MIN(number1; [number2]; ...)', description: 'Trả về giá trị nhỏ nhất trong một tập giá trị.', category: 'Thống kê' },
  { name: 'MINA', signature: 'MINA(value1; [value2]; ...)', description: 'Trả về giá trị nhỏ nhất (kể cả văn bản và lô-gic).', category: 'Thống kê' },
  { name: 'COUNT', signature: 'COUNT(value1; [value2]; ...)', description: 'Đếm số lượng ô có chứa số.', category: 'Thống kê' },
  { name: 'COUNTA', signature: 'COUNTA(value1; [value2]; ...)', description: 'Đếm số lượng ô không rỗng.', category: 'Thống kê' },
  { name: 'COUNTBLANK', signature: 'COUNTBLANK(range)', description: 'Đếm số ô rỗng trong phạm vi.', category: 'Thống kê' },
  { name: 'COUNTIF', signature: 'COUNTIF(range; criteria)', description: 'Đếm số ô trong phạm vi thỏa mãn điều kiện đã cho.', category: 'Thống kê' },

  // === NGÀY GIỜ ===
  { name: 'TODAY', signature: 'TODAY()', description: 'Trả về số sê-ri của ngày hôm nay. Dễ dàng được tự động cập nhật khi mở bảng tính.', category: 'Ngày Giờ' },
  { name: 'NOW', signature: 'NOW()', description: 'Trả về số sê-ri của ngày và giờ hiện tại.', category: 'Ngày Giờ' },
  { name: 'DATE', signature: 'DATE(year; month; day)', description: 'Trả về số sê-ri của một ngày cụ thể.', category: 'Ngày Giờ' },
  { name: 'TIME', signature: 'TIME(hour; minute; second)', description: 'Trả về số sê-ri của một thời điểm cụ thể.', category: 'Ngày Giờ' },
  { name: 'DATEVALUE', signature: 'DATEVALUE(date_text)', description: 'Chuyển đổi ngày ở dạng văn bản thành số sê-ri.', category: 'Ngày Giờ' },
  { name: 'TIMEVALUE', signature: 'TIMEVALUE(time_text)', description: 'Chuyển đổi thời gian ở dạng văn bản thành số sê-ri phần thập phân.', category: 'Ngày Giờ' },
  { name: 'YEAR', signature: 'YEAR(serial_number)', description: 'Trả về năm tương ứng với một ngày, số nguyên từ 1900-9999.', category: 'Ngày Giờ' },
  { name: 'MONTH', signature: 'MONTH(serial_number)', description: 'Trả về tháng của một ngày, số nguyên từ 1 đến 12.', category: 'Ngày Giờ' },
  { name: 'DAY', signature: 'DAY(serial_number)', description: 'Trả về ngày trong tháng, số nguyên từ 1 đến 31.', category: 'Ngày Giờ' },
  { name: 'HOUR', signature: 'HOUR(serial_number)', description: 'Trả về giờ dưới dạng số nguyên từ 0 (12:00 SA) đến 23 (11:00 CH).', category: 'Ngày Giờ' },
  { name: 'MINUTE', signature: 'MINUTE(serial_number)', description: 'Trả về phút dưới dạng số nguyên từ 0 đến 59.', category: 'Ngày Giờ' },
  { name: 'SECOND', signature: 'SECOND(serial_number)', description: 'Trả về giây dưới dạng số nguyên từ 0 đến 59.', category: 'Ngày Giờ' },
  { name: 'WEEKDAY', signature: 'WEEKDAY(serial_number; [return_type])', description: 'Trả về thứ trong tuần tương ứng với một ngày. Theo mặc định, số nguyên từ 1 (Chủ Nhật) đến 7 (Thứ Bảy).', category: 'Ngày Giờ' },
  { name: 'WEEKNUM', signature: 'WEEKNUM(serial_number; [return_type])', description: 'Trả về số thứ tự của tuần trong năm.', category: 'Ngày Giờ' },
  { name: 'ISOWEEKNUM', signature: 'ISOWEEKNUM(date)', description: 'Trả về số tuần ISO 8601 của năm cho ngày đã cho.', category: 'Ngày Giờ' },
  { name: 'DAYS', signature: 'DAYS(end_date; start_date)', description: 'Trả về số ngày giữa hai ngày.', category: 'Ngày Giờ' },
  { name: 'DAYS360', signature: 'DAYS360(start_date; end_date; [method])', description: 'Trả về số ngày giữa hai ngày dựa trên năm 360 ngày.', category: 'Ngày Giờ' },
  { name: 'DATEDIF', signature: 'DATEDIF(start_date; end_date; unit)', description: 'Tính số ngày, tháng hoặc năm giữa hai ngày. Đơn vị: "Y", "M", "D", "MD", "YM", "YD".', category: 'Ngày Giờ' },
  { name: 'EDATE', signature: 'EDATE(start_date; months)', description: 'Trả về số sê-ri của ngày là số tháng chỉ định trước hoặc sau ngày bắt đầu.', category: 'Ngày Giờ' },
  { name: 'EOMONTH', signature: 'EOMONTH(start_date; months)', description: 'Trả về số sê-ri của ngày cuối cùng trong tháng, trước hoặc sau số tháng chỉ định.', category: 'Ngày Giờ' },
  { name: 'YEARFRAC', signature: 'YEARFRAC(start_date; end_date; [basis])', description: 'Trả về phần năm thể hiện số ngày toàn phần giữa start_date và end_date.', category: 'Ngày Giờ' },
  { name: 'NETWORKDAYS', signature: 'NETWORKDAYS(start_date; end_date; [holidays])', description: 'Trả về số ngày làm việc toàn phần giữa hai ngày.', category: 'Ngày Giờ' },
  { name: 'NETWORKDAYS.INTL', signature: 'NETWORKDAYS.INTL(start_date; end_date; [weekend]; [holidays])', description: 'Trả về số ngày làm việc toàn phần với tham số ngày cuối tuần tùy chỉnh.', category: 'Ngày Giờ' },
  { name: 'WORKDAY', signature: 'WORKDAY(start_date; days; [holidays])', description: 'Trả về số sê-ri của ngày là số ngày làm việc trước hoặc sau ngày bắt đầu.', category: 'Ngày Giờ' },
  { name: 'WORKDAY.INTL', signature: 'WORKDAY.INTL(start_date; days; [weekend]; [holidays])', description: 'Trả về số sê-ri ngày trước hoặc sau số ngày làm việc, với ngày cuối tuần tùy chỉnh.', category: 'Ngày Giờ' },
  { name: 'TEXT', signature: 'TEXT(value; format_text)', description: 'Chuyển đổi một giá trị thành văn bản theo định dạng số chỉ định. Ví dụ: TEXT(TODAY();"dd/mm/yyyy").', category: 'Ngày Giờ' },
  { name: 'DATESTRING', signature: 'DATESTRING(serial_number)', description: 'Chuyển đổi số sê-ri ngày thành chuỗi ngày tháng ISO (YYYY-MM-DD).', category: 'Ngày Giờ' },
  // === CƠ SỞ DỮ LIỆU ===
  { name: 'DAVERAGE', signature: 'DAVERAGE(database; field; criteria)', description: 'Tính trung bình các giá trị trong một cột của cơ sở dữ liệu đáp ứng các điều kiện.', category: 'Cơ sở dữ liệu' },
  { name: 'DCOUNT', signature: 'DCOUNT(database; field; criteria)', description: 'Đếm các ô chứa số trong một cột của cơ sở dữ liệu đáp ứng các điều kiện.', category: 'Cơ sở dữ liệu' },
  { name: 'DCOUNTA', signature: 'DCOUNTA(database; field; criteria)', description: 'Đếm các ô không trống trong một cột của cơ sở dữ liệu đáp ứng các điều kiện.', category: 'Cơ sở dữ liệu' },
  { name: 'DGET', signature: 'DGET(database; field; criteria)', description: 'Trích xuất một bản ghi duy nhất khớp với điều kiện từ cơ sở dữ liệu.', category: 'Cơ sở dữ liệu' },
  { name: 'DMAX', signature: 'DMAX(database; field; criteria)', description: 'Trả về số lớn nhất trong một cột của cơ sở dữ liệu đáp ứng các điều kiện.', category: 'Cơ sở dữ liệu' },
  { name: 'DMIN', signature: 'DMIN(database; field; criteria)', description: 'Trả về số nhỏ nhất trong một cột của cơ sở dữ liệu đáp ứng các điều kiện.', category: 'Cơ sở dữ liệu' },
  { name: 'DPRODUCT', signature: 'DPRODUCT(database; field; criteria)', description: 'Nhân các giá trị trong một cột của cơ sở dữ liệu đáp ứng các điều kiện.', category: 'Cơ sở dữ liệu' },
  { name: 'DSUM', signature: 'DSUM(database; field; criteria)', description: 'Cộng các số trong một cột của cơ sở dữ liệu đáp ứng các điều kiện.', category: 'Cơ sở dữ liệu' },
  { name: 'DVAR', signature: 'DVAR(database; field; criteria)', description: 'Ước tính phương sai dựa trên mẫu từ cơ sở dữ liệu.', category: 'Cơ sở dữ liệu' },
  { name: 'DVARP', signature: 'DVARP(database; field; criteria)', description: 'Tính phương sai dựa trên toàn bộ tập hợp cơ sở dữ liệu.', category: 'Cơ sở dữ liệu' },
  { name: 'DSTDEV', signature: 'DSTDEV(database; field; criteria)', description: 'Ước tính độ lệch chuẩn dựa trên mẫu từ cơ sở dữ liệu.', category: 'Cơ sở dữ liệu' },
  { name: 'DSTDEVP', signature: 'DSTDEVP(database; field; criteria)', description: 'Tính độ lệch chuẩn dựa trên toàn bộ tập hợp cơ sở dữ liệu.', category: 'Cơ sở dữ liệu' },

  // === TÌM KIẾM & THAM CHIẾU ===
  { name: 'VLOOKUP', signature: 'VLOOKUP(lookup_value; table_array; col_index_num; [range_lookup])', description: 'Tìm kiếm giá trị trong cột đầu tiên của bảng và trả về giá trị trong hàng đó từ một cột khác.', category: 'Tìm kiếm & Tham chiếu' },
  { name: 'HLOOKUP', signature: 'HLOOKUP(lookup_value; table_array; row_index_num; [range_lookup])', description: 'Tìm kiếm giá trị trong hàng đầu tiên của bảng và trả về giá trị từ một hàng khác.', category: 'Tìm kiếm & Tham chiếu' },
  { name: 'XLOOKUP', signature: 'XLOOKUP(lookup_value; lookup_array; return_array; [if_not_found]; [match_mode]; [search_mode])', description: 'Tìm kiếm một dải ô hoặc một mảng và trả về một mục tương ứng với kết quả khớp đầu tiên nó tìm thấy.', category: 'Tìm kiếm & Tham chiếu' },
  { name: 'INDEX', signature: 'INDEX(array; row_num; [col_num])', description: 'Trả về giá trị của một phần tử trong một bảng hoặc một dải ô.', category: 'Tìm kiếm & Tham chiếu' },
  { name: 'MATCH', signature: 'MATCH(lookup_value; lookup_array; [match_type])', description: 'Trả về vị trí tương đối của một phần tử trong mảng.', category: 'Tìm kiếm & Tham chiếu' },
  { name: 'XMATCH', signature: 'XMATCH(lookup_value; lookup_array; [match_mode]; [search_mode])', description: 'Trả về vị trí tương đối của một mục trong mảng hoặc dải ô.', category: 'Tìm kiếm & Tham chiếu' },
  { name: 'LOOKUP', signature: 'LOOKUP(lookup_value; lookup_vector; [result_vector])', description: 'Tìm kiếm giá trị trong vectơ hoặc mảng.', category: 'Tìm kiếm & Tham chiếu' },
  { name: 'CHOOSE', signature: 'CHOOSE(index_num; value1; [value2]; ...)', description: 'Chọn một giá trị từ danh sách giá trị dựa trên số chỉ mục.', category: 'Tìm kiếm & Tham chiếu' },
  { name: 'CHOOSECOLS', signature: 'CHOOSECOLS(array; col_num1; [col_num2]; ...)', description: 'Trả về các cột được chỉ định từ mảng.', category: 'Tìm kiếm & Tham chiếu' },
  { name: 'CHOOSEROWS', signature: 'CHOOSEROWS(array; row_num1; [row_num2]; ...)', description: 'Trả về các hàng được chỉ định từ mảng.', category: 'Tìm kiếm & Tham chiếu' },
  { name: 'OFFSET', signature: 'OFFSET(reference; rows; cols; [height]; [width])', description: 'Trả về một tham chiếu tới dải ô gồm số hàng và số cột cách tham chiếu xác định.', category: 'Tìm kiếm & Tham chiếu' },
  { name: 'ROW', signature: 'ROW([reference])', description: 'Trả về số hàng của tham chiếu.', category: 'Tìm kiếm & Tham chiếu' },
  { name: 'ROWS', signature: 'ROWS(array)', description: 'Trả về số hàng trong một mảng hoặc tham chiếu.', category: 'Tìm kiếm & Tham chiếu' },
  { name: 'COLUMN', signature: 'COLUMN([reference])', description: 'Trả về số cột của tham chiếu.', category: 'Tìm kiếm & Tham chiếu' },
  { name: 'COLUMNS', signature: 'COLUMNS(array)', description: 'Trả về số cột trong một mảng hoặc tham chiếu.', category: 'Tìm kiếm & Tham chiếu' },
  { name: 'SORT', signature: 'SORT(array; [sort_index]; [sort_order]; [by_col])', description: 'Sắp xếp nội dung trong một dải ô hoặc mảng.', category: 'Tìm kiếm & Tham chiếu' },
  { name: 'SORTBY', signature: 'SORTBY(array; by_array1; [sort_order1]; ...)', description: 'Sắp xếp nội dung của một dải ô hoặc mảng dựa trên giá trị của mảng/dải ô tương ứng.', category: 'Tìm kiếm & Tham chiếu' },
  { name: 'FILTER', signature: 'FILTER(array; include; [if_empty])', description: 'Lọc dữ liệu một mảng dựa trên mảng Boolean.', category: 'Tìm kiếm & Tham chiếu' },
  { name: 'UNIQUE', signature: 'UNIQUE(array; [by_col]; [exactly_once])', description: 'Trả về danh sách các giá trị duy nhất trong một danh sách hoặc dải ô.', category: 'Tìm kiếm & Tham chiếu' },
  { name: 'TRANSPOSE', signature: 'TRANSPOSE(array)', description: 'Trả về sự chuyển vị của mảng.', category: 'Tìm kiếm & Tham chiếu' },
  { name: 'TAKE', signature: 'TAKE(array; rows; [columns])', description: 'Trả về một số hàng hoặc cột nhất định liền kề với bắt đầu hoặc kết thúc của mảng.', category: 'Tìm kiếm & Tham chiếu' },
  { name: 'DROP', signature: 'DROP(array; rows; [columns])', description: 'Loại trừ một số hàng hoặc cột nhất định từ bắt đầu hoặc kết thúc mảng.', category: 'Tìm kiếm & Tham chiếu' },
  { name: 'EXPAND', signature: 'EXPAND(array; rows; [columns]; [pad_with])', description: 'Mở rộng (đệm) một mảng với kích thước xác định.', category: 'Tìm kiếm & Tham chiếu' },
  { name: 'HSTACK', signature: 'HSTACK(array1; [array2]; ...)', description: 'Nối các mảng theo chiều ngang.', category: 'Tìm kiếm & Tham chiếu' },
  { name: 'VSTACK', signature: 'VSTACK(array1; [array2]; ...)', description: 'Nối các mảng theo chiều dọc.', category: 'Tìm kiếm & Tham chiếu' },
  { name: 'TOROW', signature: 'TOROW(array; [ignore]; [scan_by_column])', description: 'Trả về mảng thành một hàng duy nhất.', category: 'Tìm kiếm & Tham chiếu' },
  { name: 'TOCOL', signature: 'TOCOL(array; [ignore]; [scan_by_column])', description: 'Trả về mảng thành một cột duy nhất.', category: 'Tìm kiếm & Tham chiếu' },
  { name: 'WRAPROWS', signature: 'WRAPROWS(vector; wrap_count; [pad_with])', description: 'Ngắt hàng (bao bọc) mảng ngang/dọc thành hàng (2D) theo wrap_count.', category: 'Tìm kiếm & Tham chiếu' },
  { name: 'WRAPCOLS', signature: 'WRAPCOLS(vector; wrap_count; [pad_with])', description: 'Ngắt cột (bao bọc) mảng ngang/dọc thành cột (2D) theo wrap_count.', category: 'Tìm kiếm & Tham chiếu' },
  { name: 'ADDRESS', signature: 'ADDRESS(row_num; column_num; [abs_num]; [a1]; [sheet_text])', description: 'Tạo một tham chiếu ô dưới dạng văn bản (ví dụ: $A$1).', category: 'Tìm kiếm & Tham chiếu' },
  { name: 'INDIRECT', signature: 'INDIRECT(ref_text; [a1])', description: 'Trả về tham chiếu từ một chuỗi văn bản.', category: 'Tìm kiếm & Tham chiếu' },
  { name: 'HYPERLINK', signature: 'HYPERLINK(link_location; [friendly_name])', description: 'Tạo lối tắt hoặc bước nhảy để mở tài liệu, web, hoặc tệp mạng.', category: 'Tìm kiếm & Tham chiếu' },
  { name: 'FORMULATEXT', signature: 'FORMULATEXT(reference)', description: 'Trả về công thức trong tham chiếu dưới dạng văn bản.', category: 'Tìm kiếm & Tham chiếu' },
  { name: 'AREAS', signature: 'AREAS(reference)', description: 'Trả về số khu vực trong một tham chiếu.', category: 'Tìm kiếm & Tham chiếu' },
  { name: 'GETPIVOTDATA', signature: 'GETPIVOTDATA(data_field; pivot_table; [field1; item1; ...])', description: 'Trích xuất dữ liệu được lưu trữ trong PivotTable.', category: 'Tìm kiếm & Tham chiếu' },
  { name: 'RTD', signature: 'RTD(ProgID; server; topic1; [topic2]; ...)', description: 'Lấy dữ liệu thời gian thực.', category: 'Tìm kiếm & Tham chiếu' },
  { name: 'FIELDVALUE', signature: 'FIELDVALUE(value; field_name)', description: 'Truy xuất thuộc tính từ kiểu dữ liệu được liên kết.', category: 'Tìm kiếm & Tham chiếu' },

  // === THỐNG KÊ (mở rộng) ===
  // -- Phân tán & Phân phối --
  { name: 'STDEV', signature: 'STDEV(number1; [number2]; ...)', description: 'Ước tính độ lệch chuẩn dựa trên mẫu.', category: 'Thống kê' },
  { name: 'STDEV.S', signature: 'STDEV.S(number1; [number2]; ...)', description: 'Ước tính độ lệch chuẩn dựa trên mẫu (bỏ qua văn bản và giá trị lô-gic).', category: 'Thống kê' },
  { name: 'STDEVP', signature: 'STDEVP(number1; [number2]; ...)', description: 'Tính độ lệch chuẩn của toàn bộ tổng thể.', category: 'Thống kê' },
  { name: 'STDEV.P', signature: 'STDEV.P(number1; [number2]; ...)', description: 'Tính độ lệch chuẩn của toàn bộ tổng thể (bỏ qua văn bản và giá trị lô-gic).', category: 'Thống kê' },
  { name: 'STDEVA', signature: 'STDEVA(value1; [value2]; ...)', description: 'Ước tính độ lệch chuẩn dựa trên mẫu (kể cả văn bản và giá trị lô-gic).', category: 'Thống kê' },
  { name: 'STDEVPA', signature: 'STDEVPA(value1; [value2]; ...)', description: 'Tính độ lệch chuẩn của toàn bộ tổng thể (kể cả văn bản và giá trị lô-gic).', category: 'Thống kê' },
  { name: 'VAR', signature: 'VAR(number1; [number2]; ...)', description: 'Ước tính phương sai dựa trên mẫu.', category: 'Thống kê' },
  { name: 'VAR.S', signature: 'VAR.S(number1; [number2]; ...)', description: 'Ước tính phương sai dựa trên mẫu.', category: 'Thống kê' },
  { name: 'VARP', signature: 'VARP(number1; [number2]; ...)', description: 'Tính phương sai dựa trên toàn bộ tổng thể.', category: 'Thống kê' },
  { name: 'VAR.P', signature: 'VAR.P(number1; [number2]; ...)', description: 'Tính phương sai dựa trên toàn bộ tổng thể.', category: 'Thống kê' },
  { name: 'MEDIAN', signature: 'MEDIAN(number1; [number2]; ...)', description: 'Trả về số trung vị của các số đã cho.', category: 'Thống kê' },
  { name: 'MODE', signature: 'MODE(number1; [number2]; ...)', description: 'Trả về giá trị xuất hiện nhiều nhất trong một mảng hoặc dải dữ liệu.', category: 'Thống kê' },
  { name: 'MODE.SNGL', signature: 'MODE.SNGL(number1; [number2]; ...)', description: 'Trả về giá trị xuất hiện nhiều nhất (một giá trị).', category: 'Thống kê' },
  { name: 'MODE.MULT', signature: 'MODE.MULT(number1; [number2]; ...)', description: 'Trả về mảng dọc của các giá trị xuất hiện nhiều nhất.', category: 'Thống kê' },
  { name: 'SKEW', signature: 'SKEW(number1; [number2]; ...)', description: 'Trả về độ lệch của một phân phối.', category: 'Thống kê' },
  { name: 'SKEW.P', signature: 'SKEW.P(number1; [number2]; ...)', description: 'Trả về độ lệch của phân phối dựa trên tổng thể.', category: 'Thống kê' },
  { name: 'KURT', signature: 'KURT(number1; [number2]; ...)', description: 'Trả về độ nhọn (kurtosis) của một tập dữ liệu.', category: 'Thống kê' },
  { name: 'GEOMEAN', signature: 'GEOMEAN(number1; [number2]; ...)', description: 'Trả về trung bình nhân của một dãy số dương.', category: 'Thống kê' },
  { name: 'HARMEAN', signature: 'HARMEAN(number1; [number2]; ...)', description: 'Trả về trung bình điều hòa của một tập dữ liệu.', category: 'Thống kê' },
  { name: 'DEVSQ', signature: 'DEVSQ(number1; [number2]; ...)', description: 'Trả về tổng bình phương các độ lệch so với trung bình.', category: 'Thống kê' },
  { name: 'AVEDEV', signature: 'AVEDEV(number1; [number2]; ...)', description: 'Trả về trung bình độ lệch tuyệt đối của các điểm dữ liệu.', category: 'Thống kê' },
  // -- Tương quan / Hồi quy --
  { name: 'COVAR', signature: 'COVAR(array1; array2)', description: 'Trả về hiệp phương sai, trung bình của tích các độ lệch của mỗi cặp điểm dữ liệu.', category: 'Thống kê' },
  { name: 'COVARIANCE.P', signature: 'COVARIANCE.P(array1; array2)', description: 'Trả về hiệp phương sai tổng thể.', category: 'Thống kê' },
  { name: 'COVARIANCE.S', signature: 'COVARIANCE.S(array1; array2)', description: 'Trả về hiệp phương sai mẫu.', category: 'Thống kê' },
  { name: 'CORREL', signature: 'CORREL(array1; array2)', description: 'Trả về hệ số tương quan giữa hai tập dữ liệu.', category: 'Thống kê' },
  { name: 'PEARSON', signature: 'PEARSON(array1; array2)', description: 'Trả về hệ số tương quan tích-khoảnh Pearson.', category: 'Thống kê' },
  { name: 'RSQ', signature: 'RSQ(known_y; known_x)', description: 'Trả về bình phương của hệ số tương quan Pearson.', category: 'Thống kê' },
  { name: 'SLOPE', signature: 'SLOPE(known_y; known_x)', description: 'Trả về độ dốc của đường hồi quy tuyến tính.', category: 'Thống kê' },
  { name: 'INTERCEPT', signature: 'INTERCEPT(known_y; known_x)', description: 'Trả về điểm giao nhau của đường hồi quy tuyến tính với trục y.', category: 'Thống kê' },
  { name: 'FORECAST', signature: 'FORECAST(x; known_y; known_x)', description: 'Tính hoặc dự báo giá trị tương lai bằng các giá trị hiện có.', category: 'Thống kê' },
  { name: 'FORECAST.LINEAR', signature: 'FORECAST.LINEAR(x; known_y; known_x)', description: 'Dự báo giá trị dựa trên hồi quy tuyến tính.', category: 'Thống kê' },
  { name: 'TREND', signature: 'TREND(known_y; [known_x]; [new_x])', description: 'Trả về các giá trị dọc theo xu hướng tuyến tính.', category: 'Thống kê' },
  { name: 'GROWTH', signature: 'GROWTH(known_y; [known_x]; [new_x])', description: 'Trả về các giá trị dọc theo xu hướng lũy thừa.', category: 'Thống kê' },
  { name: 'LINEST', signature: 'LINEST(known_y; [known_x]; [const]; [stats])', description: 'Trả về thống kê cho đường thẳng khớp nhất với dữ liệu.', category: 'Thống kê' },
  { name: 'LOGEST', signature: 'LOGEST(known_y; [known_x]; [const]; [stats])', description: 'Trả về thống kê cho đường cong lũy thừa khớp nhất với dữ liệu.', category: 'Thống kê' },
  { name: 'STEYX', signature: 'STEYX(known_y; known_x)', description: 'Trả về sai số chuẩn của giá trị y dự đoán trong hồi quy.', category: 'Thống kê' },
  // -- Xếp hạng --
  { name: 'RANK', signature: 'RANK(number; ref; [order])', description: 'Trả về thứ hạng của một số trong danh sách.', category: 'Thống kê' },
  { name: 'RANK.EQ', signature: 'RANK.EQ(number; ref; [order])', description: 'Trả về thứ hạng của một số trong danh sách (bằng nhau thì cùng hạng).', category: 'Thống kê' },
  { name: 'RANK.AVG', signature: 'RANK.AVG(number; ref; [order])', description: 'Trả về thứ hạng trung bình khi có các giá trị bằng nhau.', category: 'Thống kê' },
  { name: 'PERCENTRANK', signature: 'PERCENTRANK(array; x; [significance])', description: 'Trả về thứ hạng phần trăm của giá trị trong tập dữ liệu.', category: 'Thống kê' },
  { name: 'PERCENTRANK.INC', signature: 'PERCENTRANK.INC(array; x; [significance])', description: 'Trả về thứ hạng phần trăm (0 đến 1, kể cả).', category: 'Thống kê' },
  { name: 'PERCENTRANK.EXC', signature: 'PERCENTRANK.EXC(array; x; [significance])', description: 'Trả về thứ hạng phần trăm (0 đến 1, không kể cả).', category: 'Thống kê' },
  { name: 'PERCENTILE', signature: 'PERCENTILE(array; k)', description: 'Trả về giá trị phân vị thứ k trong một phạm vi.', category: 'Thống kê' },
  { name: 'PERCENTILE.INC', signature: 'PERCENTILE.INC(array; k)', description: 'Trả về giá trị phân vị thứ k (kể cả 0 và 1).', category: 'Thống kê' },
  { name: 'PERCENTILE.EXC', signature: 'PERCENTILE.EXC(array; k)', description: 'Trả về giá trị phân vị thứ k (không kể cả 0 và 1).', category: 'Thống kê' },
  { name: 'QUARTILE', signature: 'QUARTILE(array; quart)', description: 'Trả về tứ phân vị của tập dữ liệu.', category: 'Thống kê' },
  { name: 'QUARTILE.INC', signature: 'QUARTILE.INC(array; quart)', description: 'Trả về tứ phân vị (kể cả 0 và 1).', category: 'Thống kê' },
  { name: 'QUARTILE.EXC', signature: 'QUARTILE.EXC(array; quart)', description: 'Trả về tứ phân vị (không kể cả 0 và 1).', category: 'Thống kê' },
  { name: 'LARGE', signature: 'LARGE(array; k)', description: 'Trả về giá trị lớn thứ k trong tập dữ liệu.', category: 'Thống kê' },
  { name: 'SMALL', signature: 'SMALL(array; k)', description: 'Trả về giá trị nhỏ thứ k trong tập dữ liệu.', category: 'Thống kê' },
  { name: 'FREQUENCY', signature: 'FREQUENCY(data_array; bins_array)', description: 'Đếm tần suất giá trị xuất hiện trong dải giá trị.', category: 'Thống kê' },
  // -- Điều kiện nhiều tiêu chí --
  { name: 'COUNTIFS', signature: 'COUNTIFS(criteria_range1; criteria1; [criteria_range2; criteria2]; ...)', description: 'Đếm số ô thỏa mãn nhiều điều kiện.', category: 'Thống kê' },
  { name: 'SUMIFS', signature: 'SUMIFS(sum_range; criteria_range1; criteria1; ...)', description: 'Tính tổng các ô thỏa mãn nhiều điều kiện.', category: 'Thống kê' },
  { name: 'AVERAGEIF', signature: 'AVERAGEIF(range; criteria; [average_range])', description: 'Trả về trung bình cộng của tất cả các ô thỏa mãn điều kiện đã cho.', category: 'Thống kê' },
  { name: 'PROB', signature: 'PROB(x_range; prob_range; lower_limit; [upper_limit])', description: 'Trả về xác suất của các giá trị trong dải nằm giữa hai giới hạn.', category: 'Thống kê' },
  // -- Kiểm định giả thuyết --
  { name: 'TTEST', signature: 'TTEST(array1; array2; tails; type)', description: 'Trả về xác suất liên quan đến kiểm định t của Student.', category: 'Thống kê' },
  { name: 'T.TEST', signature: 'T.TEST(array1; array2; tails; type)', description: 'Trả về xác suất liên quan đến kiểm định t của Student.', category: 'Thống kê' },
  { name: 'FTEST', signature: 'FTEST(array1; array2)', description: 'Trả về kết quả của kiểm định F.', category: 'Thống kê' },
  { name: 'F.TEST', signature: 'F.TEST(array1; array2)', description: 'Trả về kết quả của kiểm định F.', category: 'Thống kê' },
  { name: 'CHITEST', signature: 'CHITEST(actual_range; expected_range)', description: 'Trả về kiểm định Chi bình phương về sự phù hợp.', category: 'Thống kê' },
  { name: 'CHISQ.TEST', signature: 'CHISQ.TEST(actual_range; expected_range)', description: 'Trả về kiểm định Chi bình phương về sự phù hợp.', category: 'Thống kê' },
  { name: 'ZTEST', signature: 'ZTEST(array; x; [sigma])', description: 'Trả về giá trị xác suất một đuôi của kiểm định z.', category: 'Thống kê' },
  { name: 'Z.TEST', signature: 'Z.TEST(array; x; [sigma])', description: 'Trả về giá trị xác suất một đuôi của kiểm định z.', category: 'Thống kê' },
  // -- Phân phối chuẩn --
  { name: 'NORM.DIST', signature: 'NORM.DIST(x; mean; standard_dev; cumulative)', description: 'Trả về phân phối chuẩn với trung bình và độ lệch chuẩn đã cho.', category: 'Thống kê' },
  { name: 'NORMDIST', signature: 'NORMDIST(x; mean; standard_dev; cumulative)', description: 'Trả về phân phối chuẩn với trung bình và độ lệch chuẩn đã cho.', category: 'Thống kê' },
  { name: 'NORM.INV', signature: 'NORM.INV(probability; mean; standard_dev)', description: 'Trả về giá trị nghịch đảo của phân phối tích lũy chuẩn.', category: 'Thống kê' },
  { name: 'NORMINV', signature: 'NORMINV(probability; mean; standard_dev)', description: 'Trả về giá trị nghịch đảo của phân phối tích lũy chuẩn.', category: 'Thống kê' },
  { name: 'NORM.S.DIST', signature: 'NORM.S.DIST(z; cumulative)', description: 'Trả về phân phối chuẩn hóa.', category: 'Thống kê' },
  { name: 'NORMSDIST', signature: 'NORMSDIST(z)', description: 'Trả về hàm phân phối chuẩn hóa.', category: 'Thống kê' },
  { name: 'NORM.S.INV', signature: 'NORM.S.INV(probability)', description: 'Trả về nghịch đảo của phân phối tích lũy chuẩn hóa.', category: 'Thống kê' },
  { name: 'NORMSINV', signature: 'NORMSINV(probability)', description: 'Trả về nghịch đảo của phân phối tích lũy chuẩn hóa.', category: 'Thống kê' },
  { name: 'STANDARDIZE', signature: 'STANDARDIZE(x; mean; standard_dev)', description: 'Trả về giá trị chuẩn hóa từ phân phối được mô tả bởi mean và standard_dev.', category: 'Thống kê' },
  // -- Phân phối t / F / Chi --
  { name: 'T.DIST', signature: 'T.DIST(x; deg_freedom; cumulative)', description: 'Trả về phân phối t của Student (đuôi trái).', category: 'Thống kê' },
  { name: 'T.DIST.2T', signature: 'T.DIST.2T(x; deg_freedom)', description: 'Trả về phân phối t của Student (hai đuôi).', category: 'Thống kê' },
  { name: 'T.DIST.RT', signature: 'T.DIST.RT(x; deg_freedom)', description: 'Trả về phân phối t của Student (đuôi phải).', category: 'Thống kê' },
  { name: 'TDIST', signature: 'TDIST(x; deg_freedom; tails)', description: 'Trả về phân phối t của Student.', category: 'Thống kê' },
  { name: 'T.INV', signature: 'T.INV(probability; deg_freedom)', description: 'Trả về giá trị t của phân phối t của Student (đuôi trái).', category: 'Thống kê' },
  { name: 'T.INV.2T', signature: 'T.INV.2T(probability; deg_freedom)', description: 'Trả về giá trị t của phân phối t của Student (hai đuôi).', category: 'Thống kê' },
  { name: 'TINV', signature: 'TINV(probability; deg_freedom)', description: 'Trả về giá trị t của phân phối t của Student.', category: 'Thống kê' },
  { name: 'F.DIST', signature: 'F.DIST(x; deg_freedom1; deg_freedom2; cumulative)', description: 'Trả về phân phối xác suất F.', category: 'Thống kê' },
  { name: 'F.DIST.RT', signature: 'F.DIST.RT(x; deg_freedom1; deg_freedom2)', description: 'Trả về phân phối xác suất F (đuôi phải).', category: 'Thống kê' },
  { name: 'FDIST', signature: 'FDIST(x; deg_freedom1; deg_freedom2)', description: 'Trả về phân phối xác suất F.', category: 'Thống kê' },
  { name: 'F.INV', signature: 'F.INV(probability; deg_freedom1; deg_freedom2)', description: 'Trả về giá trị nghịch đảo của phân phối xác suất F.', category: 'Thống kê' },
  { name: 'F.INV.RT', signature: 'F.INV.RT(probability; deg_freedom1; deg_freedom2)', description: 'Trả về giá trị nghịch đảo của phân phối xác suất F (đuôi phải).', category: 'Thống kê' },
  { name: 'FINV', signature: 'FINV(probability; deg_freedom1; deg_freedom2)', description: 'Trả về giá trị nghịch đảo của phân phối xác suất F.', category: 'Thống kê' },
  { name: 'CHISQ.DIST', signature: 'CHISQ.DIST(x; deg_freedom; cumulative)', description: 'Trả về phân phối tích lũy bêta.', category: 'Thống kê' },
  { name: 'CHISQ.DIST.RT', signature: 'CHISQ.DIST.RT(x; deg_freedom)', description: 'Trả về xác suất đuôi phải của phân phối chi bình phương.', category: 'Thống kê' },
  { name: 'CHIDIST', signature: 'CHIDIST(x; deg_freedom)', description: 'Trả về xác suất đuôi phải của phân phối chi bình phương.', category: 'Thống kê' },
  { name: 'CHISQ.INV', signature: 'CHISQ.INV(probability; deg_freedom)', description: 'Trả về giá trị nghịch đảo của phân phối chi bình phương (đuôi trái).', category: 'Thống kê' },
  { name: 'CHISQ.INV.RT', signature: 'CHISQ.INV.RT(probability; deg_freedom)', description: 'Trả về giá trị nghịch đảo của phân phối chi bình phương (đuôi phải).', category: 'Thống kê' },
  { name: 'CHIINV', signature: 'CHIINV(probability; deg_freedom)', description: 'Trả về giá trị nghịch đảo của phân phối chi bình phương.', category: 'Thống kê' },
  // -- Phân phối rời rạc --
  { name: 'BINOM.DIST', signature: 'BINOM.DIST(number_s; trials; probability_s; cumulative)', description: 'Trả về xác suất của phân phối nhị thức.', category: 'Thống kê' },
  { name: 'BINOMDIST', signature: 'BINOMDIST(number_s; trials; probability_s; cumulative)', description: 'Trả về xác suất của phân phối nhị thức.', category: 'Thống kê' },
  { name: 'BINOM.DIST.RANGE', signature: 'BINOM.DIST.RANGE(trials; probability_s; number_s; [number_s2])', description: 'Trả về xác suất thử nghiệm sử dụng phân phối nhị thức.', category: 'Thống kê' },
  { name: 'BINOM.INV', signature: 'BINOM.INV(trials; probability_s; alpha)', description: 'Trả về giá trị nghịch đảo của phân phối nhị thức.', category: 'Thống kê' },
  { name: 'CRITBINOM', signature: 'CRITBINOM(trials; probability_s; alpha)', description: 'Trả về giá trị nghịch đảo của phân phối nhị thức.', category: 'Thống kê' },
  { name: 'POISSON.DIST', signature: 'POISSON.DIST(x; mean; cumulative)', description: 'Trả về phân phối Poisson.', category: 'Thống kê' },
  { name: 'POISSON', signature: 'POISSON(x; mean; cumulative)', description: 'Trả về phân phối Poisson.', category: 'Thống kê' },
  { name: 'HYPGEOM.DIST', signature: 'HYPGEOM.DIST(sample_s; number_sample; population_s; number_pop; cumulative)', description: 'Trả về phân phối siêu bội.', category: 'Thống kê' },
  { name: 'HYPGEOMDIST', signature: 'HYPGEOMDIST(sample_s; number_sample; population_s; number_pop)', description: 'Trả về phân phối siêu bội.', category: 'Thống kê' },
  { name: 'NEGBINOM.DIST', signature: 'NEGBINOM.DIST(number_f; number_s; probability_s; cumulative)', description: 'Trả về phân phối nhị thức âm.', category: 'Thống kê' },
  { name: 'NEGBINOMDIST', signature: 'NEGBINOMDIST(number_f; number_s; probability_s)', description: 'Trả về phân phối nhị thức âm.', category: 'Thống kê' },
  // -- Phân phối liên tục khác --
  { name: 'LOGNORM.DIST', signature: 'LOGNORM.DIST(x; mean; standard_dev; cumulative)', description: 'Trả về phân phối lô-ga-rít chuẩn.', category: 'Thống kê' },
  { name: 'LOGNORMDIST', signature: 'LOGNORMDIST(x; mean; standard_dev)', description: 'Trả về phân phối lô-ga-rít chuẩn.', category: 'Thống kê' },
  { name: 'LOGNORM.INV', signature: 'LOGNORM.INV(probability; mean; standard_dev)', description: 'Trả về giá trị nghịch đảo của phân phối lô-ga-rít chuẩn.', category: 'Thống kê' },
  { name: 'LOGINV', signature: 'LOGINV(probability; mean; standard_dev)', description: 'Trả về giá trị nghịch đảo của phân phối lô-ga-rít chuẩn.', category: 'Thống kê' },
  { name: 'EXPON.DIST', signature: 'EXPON.DIST(x; lambda; cumulative)', description: 'Trả về phân phối mũ.', category: 'Thống kê' },
  { name: 'EXPONDIST', signature: 'EXPONDIST(x; lambda; cumulative)', description: 'Trả về phân phối mũ.', category: 'Thống kê' },
  { name: 'WEIBULL.DIST', signature: 'WEIBULL.DIST(x; alpha; beta; cumulative)', description: 'Trả về phân phối Weibull.', category: 'Thống kê' },
  { name: 'WEIBULL', signature: 'WEIBULL(x; alpha; beta; cumulative)', description: 'Trả về phân phối Weibull.', category: 'Thống kê' },
  { name: 'BETA.DIST', signature: 'BETA.DIST(x; alpha; beta; cumulative; [A]; [B])', description: 'Trả về hàm phân phối tích lũy bêta.', category: 'Thống kê' },
  { name: 'BETADIST', signature: 'BETADIST(x; alpha; beta; [A]; [B])', description: 'Trả về hàm phân phối tích lũy bêta.', category: 'Thống kê' },
  { name: 'BETA.INV', signature: 'BETA.INV(probability; alpha; beta; [A]; [B])', description: 'Trả về giá trị nghịch đảo của hàm phân phối tích lũy bêta.', category: 'Thống kê' },
  { name: 'BETAINV', signature: 'BETAINV(probability; alpha; beta; [A]; [B])', description: 'Trả về giá trị nghịch đảo của hàm phân phối tích lũy bêta.', category: 'Thống kê' },
  { name: 'GAMMA.DIST', signature: 'GAMMA.DIST(x; alpha; beta; cumulative)', description: 'Trả về phân phối gamma.', category: 'Thống kê' },
  { name: 'GAMMADIST', signature: 'GAMMADIST(x; alpha; beta; cumulative)', description: 'Trả về phân phối gamma.', category: 'Thống kê' },
  { name: 'GAMMA.INV', signature: 'GAMMA.INV(probability; alpha; beta)', description: 'Trả về giá trị nghịch đảo của phân phối tích lũy gamma.', category: 'Thống kê' },
  { name: 'GAMMAINV', signature: 'GAMMAINV(probability; alpha; beta)', description: 'Trả về giá trị nghịch đảo của phân phối tích lũy gamma.', category: 'Thống kê' },
  { name: 'GAMMALN', signature: 'GAMMALN(x)', description: 'Trả về logarithm tự nhiên của hàm gamma.', category: 'Thống kê' },
  { name: 'GAMMALN.PRECISE', signature: 'GAMMALN.PRECISE(x)', description: 'Trả về logarithm tự nhiên của hàm gamma (chính xác).', category: 'Thống kê' },
  { name: 'GAMMA', signature: 'GAMMA(number)', description: 'Trả về giá trị của hàm gamma.', category: 'Thống kê' },
  // -- Khoảng tin cậy --
  { name: 'CONFIDENCE', signature: 'CONFIDENCE(alpha; standard_dev; size)', description: 'Trả về khoảng tin cậy cho giá trị trung bình tổng thể.', category: 'Thống kê' },
  { name: 'CONFIDENCE.NORM', signature: 'CONFIDENCE.NORM(alpha; standard_dev; size)', description: 'Trả về khoảng tin cậy (phân phối chuẩn).', category: 'Thống kê' },
  { name: 'CONFIDENCE.T', signature: 'CONFIDENCE.T(alpha; standard_dev; size)', description: 'Trả về khoảng tin cậy (phân phối t).', category: 'Thống kê' },
  // -- Biến đổi --
  { name: 'FISHER', signature: 'FISHER(x)', description: 'Trả về biến đổi Fisher.', category: 'Thống kê' },
  { name: 'FISHERINV', signature: 'FISHERINV(y)', description: 'Trả về giá trị nghịch đảo của biến đổi Fisher.', category: 'Thống kê' },

  // === LÔ-GIC ===
  { name: 'AND', signature: 'AND(logical1; [logical2]; ...)', description: 'Kiểm tra xem tất cả các đối số có phải là TRUE không và trả về TRUE nếu tất cả đối số là TRUE.', category: 'Lô-gic' },
  { name: 'FALSE', signature: 'FALSE()', description: 'Trả về giá trị lô-gic FALSE.', category: 'Lô-gic' },
  { name: 'IF', signature: 'IF(logical_test; [value_if_true]; [value_if_false])', description: 'Kiểm tra một điều kiện được đáp ứng không, trả về một giá trị nếu TRUE và giá trị khác nếu FALSE.', category: 'Lô-gic' },
  { name: 'IFERROR', signature: 'IFERROR(value; value_if_error)', description: 'Trả về giá trị bạn chỉ định nếu công thức đánh giá có lỗi, ngược lại trả về kết quả công thức.', category: 'Lô-gic' },
  { name: 'IFNA', signature: 'IFNA(value; value_if_na)', description: 'Trả về giá trị bạn chỉ định nếu biểu thức quy ra lỗi #N/A, ngược lại trả về kết quả của biểu thức.', category: 'Lô-gic' },
  { name: 'IFS', signature: 'IFS(logical_test1; value_if_true1; ...)', description: 'Kiểm tra xem có đáp ứng một hoặc nhiều điều kiện không và trả về giá trị tương ứng với điều kiện TRUE đầu tiên.', category: 'Lô-gic' },
  { name: 'NOT', signature: 'NOT(logical)', description: 'Đảo ngược giá trị lô-gic của đối số.', category: 'Lô-gic' },
  { name: 'OR', signature: 'OR(logical1; [logical2]; ...)', description: 'Kiểm tra xem có đối số nào là TRUE không và trả về TRUE hoặc FALSE. Trả về FALSE chỉ khi tất cả đối số là FALSE.', category: 'Lô-gic' },
  { name: 'SWITCH', signature: 'SWITCH(expression; value1; result1; [default_or_value2]; [result2]; ...)', description: 'Đánh giá một biểu thức khớp với danh sách các giá trị và trả về kết quả tương ứng với giá trị khớp đầu tiên.', category: 'Lô-gic' },
  { name: 'TRUE', signature: 'TRUE()', description: 'Trả về giá trị lô-gic TRUE.', category: 'Lô-gic' },
  { name: 'XOR', signature: 'XOR(logical1; [logical2]; ...)', description: 'Trả về OR loại trừ lô-gic của tất cả đối số (lẻ TRUE -> TRUE, chẵn TRUE -> FALSE).', category: 'Lô-gic' },

  // === VĂN BẢN ===
  { name: 'CHAR', signature: 'CHAR(number)', description: 'Trả về ký tự được xác định bởi số mã (từ bộ ký tự trên máy tính của bạn).', category: 'Văn bản' },
  { name: 'CLEAN', signature: 'CLEAN(text)', description: 'Loại bỏ tất cả các ký tự không in được khỏi văn bản.', category: 'Văn bản' },
  { name: 'CODE', signature: 'CODE(text)', description: 'Trả về mã số cho ký tự đầu tiên trong chuỗi văn bản.', category: 'Văn bản' },
  { name: 'CONCAT', signature: 'CONCAT(text1; [text2]; ...)', description: 'Nối văn bản từ nhiều dải ô và/hoặc chuỗi văn bản (có thể nhận dải ô, không phân cách).', category: 'Văn bản' },
  { name: 'CONCATENATE', signature: 'CONCATENATE(text1; [text2]; ...)', description: 'Nối nhiều chuỗi văn bản thành một chuỗi duy nhất.', category: 'Văn bản' },
  { name: 'DOLLAR', signature: 'DOLLAR(number; [decimals])', description: 'Chuyển đổi một số thành văn bản, dùng định dạng tiền tệ ($).', category: 'Văn bản' },
  { name: 'EXACT', signature: 'EXACT(text1; text2)', description: 'Kiểm tra xem hai chuỗi văn bản có hoàn toàn giống nhau không (có phân biệt chữ hoa, chữ thường).', category: 'Văn bản' },
  { name: 'FIND', signature: 'FIND(find_text; within_text; [start_num])', description: 'Tìm vị trí bắt đầu của một chuỗi văn bản bên trong một chuỗi khác (phân biệt chữ hoa/thường).', category: 'Văn bản' },
  { name: 'FIXED', signature: 'FIXED(number; [decimals]; [no_commas])', description: 'Định dạng số thành văn bản với số lượng số thập phân cố định.', category: 'Văn bản' },
  { name: 'LEFT', signature: 'LEFT(text; [num_chars])', description: 'Trả về các ký tự ngoài cùng bên trái trong chuỗi văn bản.', category: 'Văn bản' },
  { name: 'LEN', signature: 'LEN(text)', description: 'Trả về số ký tự trong một chuỗi văn bản.', category: 'Văn bản' },
  { name: 'LOWER', signature: 'LOWER(text)', description: 'Chuyển đổi tất cả các chữ cái trong chuỗi văn bản thành chữ thường.', category: 'Văn bản' },
  { name: 'MID', signature: 'MID(text; start_num; num_chars)', description: 'Trả về một số lượng ký tự cụ thể từ chuỗi văn bản, bắt đầu tại vị trí bạn chỉ định.', category: 'Văn bản' },
  { name: 'NUMBERVALUE', signature: 'NUMBERVALUE(text; [decimal_separator]; [group_separator])', description: 'Chuyển đổi văn bản thành số một cách độc lập với ngôn ngữ khu vực.', category: 'Văn bản' },
  { name: 'PROPER', signature: 'PROPER(text)', description: 'Viết hoa chữ cái đầu tiên của mỗi từ trong chuỗi văn bản.', category: 'Văn bản' },
  { name: 'REPLACE', signature: 'REPLACE(old_text; start_num; num_chars; new_text)', description: 'Thay thế các ký tự bên trong văn bản, dựa trên số lượng ký tự chỉ định.', category: 'Văn bản' },
  { name: 'REPT', signature: 'REPT(text; number_times)', description: 'Lặp lại văn bản một số lần cho trước.', category: 'Văn bản' },
  { name: 'RIGHT', signature: 'RIGHT(text; [num_chars])', description: 'Trả về các ký tự ngoài cùng bên phải trong chuỗi văn bản.', category: 'Văn bản' },
  { name: 'SEARCH', signature: 'SEARCH(find_text; within_text; [start_num])', description: 'Tìm vị trí của một chuỗi văn bản bên trong chuỗi khác (không phân biệt chữ hoa/thường).', category: 'Văn bản' },
  { name: 'SUBSTITUTE', signature: 'SUBSTITUTE(text; old_text; new_text; [instance_num])', description: 'Thay thế văn bản cũ bằng văn bản mới trong một chuỗi văn bản (dựa trên chuỗi cụ thể).', category: 'Văn bản' },
  { name: 'T', signature: 'T(value)', description: 'Trả về văn bản được tham chiếu, hoặc trả về rỗng nếu không phải văn bản.', category: 'Văn bản' },
  { name: 'TEXTAFTER', signature: 'TEXTAFTER(text; delimiter; [instance_num]; [match_mode]; [match_end]; [if_not_found])', description: 'Trả về văn bản xuất hiện sau (các) ký tự hoặc chuỗi xác định.', category: 'Văn bản' },
  { name: 'TEXTBEFORE', signature: 'TEXTBEFORE(text; delimiter; [instance_num]; [match_mode]; [match_end]; [if_not_found])', description: 'Trả về văn bản xuất hiện trước (các) ký tự hoặc chuỗi xác định.', category: 'Văn bản' },
  { name: 'TEXTJOIN', signature: 'TEXTJOIN(delimiter; ignore_empty; text1; [text2]; ...)', description: 'Kết hợp văn bản từ nhiều dải ô và/hoặc chuỗi (có dải phân cách).', category: 'Văn bản' },
  { name: 'TEXTSPLIT', signature: 'TEXTSPLIT(text; col_delimiter; [row_delimiter]; [ignore_empty]; [match_mode]; [pad_with])', description: 'Chia chuỗi văn bản thành mảng theo các dấu phân cách cột và hàng.', category: 'Văn bản' },
  { name: 'TRIM', signature: 'TRIM(text)', description: 'Loại bỏ các khoảng trắng thừa ra khỏi văn bản.', category: 'Văn bản' },
  { name: 'UNICHAR', signature: 'UNICHAR(number)', description: 'Trả về ký tự Unicode tương ứng với giá trị số đã cho.', category: 'Văn bản' },
  { name: 'UNICODE', signature: 'UNICODE(text)', description: 'Trả về số điểm mã của ký tự đầu tiên trong đoạn văn bản Unicode.', category: 'Văn bản' },
  { name: 'UPPER', signature: 'UPPER(text)', description: 'Chuyển đổi văn bản sang chữ hoa.', category: 'Văn bản' },
  { name: 'VALUE', signature: 'VALUE(text)', description: 'Chuyển đổi chuỗi văn bản biểu thị một số thành một số.', category: 'Văn bản' },

  // === THÔNG TIN ===
  { name: 'CELL', signature: 'CELL(info_type; [reference])', description: 'Trả về thông tin về định dạng, vị trí hoặc nội dung của ô.', category: 'Thông tin' },
  { name: 'ERROR.TYPE', signature: 'ERROR.TYPE(error_val)', description: 'Trả về số tương ứng với kiểu lỗi.', category: 'Thông tin' },
  { name: 'INFO', signature: 'INFO(type_text)', description: 'Trả về thông tin về môi trường hoạt động hiện tại.', category: 'Thông tin' },
  { name: 'ISBLANK', signature: 'ISBLANK(value)', description: 'Trả về TRUE nếu giá trị rỗng.', category: 'Thông tin' },
  { name: 'ISERR', signature: 'ISERR(value)', description: 'Trả về TRUE nếu giá trị là giá trị lỗi (trừ #N/A).', category: 'Thông tin' },
  { name: 'ISERROR', signature: 'ISERROR(value)', description: 'Trả về TRUE nếu giá trị là giá trị lỗi.', category: 'Thông tin' },
  { name: 'ISEVEN', signature: 'ISEVEN(number)', description: 'Trả về TRUE nếu số là số chẵn.', category: 'Thông tin' },
  { name: 'ISFORMULA', signature: 'ISFORMULA(reference)', description: 'Trả về TRUE nếu tham chiếu là ô chứa công thức.', category: 'Thông tin' },
  { name: 'ISLOGICAL', signature: 'ISLOGICAL(value)', description: 'Trả về TRUE nếu giá trị là giá trị lô-gic.', category: 'Thông tin' },
  { name: 'ISNA', signature: 'ISNA(value)', description: 'Trả về TRUE nếu giá trị là giá trị lỗi #N/A.', category: 'Thông tin' },
  { name: 'ISNONTEXT', signature: 'ISNONTEXT(value)', description: 'Trả về TRUE nếu giá trị không phải là văn bản (bao gồm ô rỗng).', category: 'Thông tin' },
  { name: 'ISNUMBER', signature: 'ISNUMBER(value)', description: 'Trả về TRUE nếu giá trị là số.', category: 'Thông tin' },
  { name: 'ISODD', signature: 'ISODD(number)', description: 'Trả về TRUE nếu số là số lẻ.', category: 'Thông tin' },
  { name: 'ISREF', signature: 'ISREF(value)', description: 'Trả về TRUE nếu giá trị là một tham chiếu.', category: 'Thông tin' },
  { name: 'ISTEXT', signature: 'ISTEXT(value)', description: 'Trả về TRUE nếu giá trị là văn bản.', category: 'Thông tin' },
  { name: 'N', signature: 'N(value)', description: 'Trả về một giá trị được chuyển đổi thành một số.', category: 'Thông tin' },
  { name: 'NA', signature: 'NA()', description: 'Trả về giá trị lỗi #N/A.', category: 'Thông tin' },
  { name: 'SHEET', signature: 'SHEET([value])', description: 'Trả về số trang tính của trang tính được tham chiếu.', category: 'Thông tin' },
  { name: 'SHEETS', signature: 'SHEETS([reference])', description: 'Trả về số lượng trang tính trong một tham chiếu.', category: 'Thông tin' },
  { name: 'TYPE', signature: 'TYPE(value)', description: 'Trả về một số đại diện cho kiểu dữ liệu của một giá trị.', category: 'Thông tin' },

  // === KỸ THUẬT ===
  { name: 'BIN2DEC', signature: 'BIN2DEC(number)', description: 'Chuyển đổi một số nhị phân thành số thập phân.', category: 'Kỹ thuật' },
  { name: 'BIN2HEX', signature: 'BIN2HEX(number; [places])', description: 'Chuyển đổi một số nhị phân thành số thập lục phân.', category: 'Kỹ thuật' },
  { name: 'BIN2OCT', signature: 'BIN2OCT(number; [places])', description: 'Chuyển đổi một số nhị phân thành bát phân.', category: 'Kỹ thuật' },
  { name: 'DEC2BIN', signature: 'DEC2BIN(number; [places])', description: 'Chuyển đổi một số thập phân thành nhị phân.', category: 'Kỹ thuật' },
  { name: 'DEC2HEX', signature: 'DEC2HEX(number; [places])', description: 'Chuyển đổi một số thập phân thành thập lục phân.', category: 'Kỹ thuật' },
  { name: 'DEC2OCT', signature: 'DEC2OCT(number; [places])', description: 'Chuyển đổi một số thập phân thành bát phân.', category: 'Kỹ thuật' },
  { name: 'HEX2BIN', signature: 'HEX2BIN(number; [places])', description: 'Chuyển đổi một số thập lục phân thành nhị phân.', category: 'Kỹ thuật' },
  { name: 'HEX2DEC', signature: 'HEX2DEC(number)', description: 'Chuyển đổi một số thập lục phân thành thập phân.', category: 'Kỹ thuật' },
  { name: 'HEX2OCT', signature: 'HEX2OCT(number; [places])', description: 'Chuyển đổi một số thập lục phân thành bát phân.', category: 'Kỹ thuật' },
  { name: 'OCT2BIN', signature: 'OCT2BIN(number; [places])', description: 'Chuyển đổi một số bát phân thành nhị phân.', category: 'Kỹ thuật' },
  { name: 'OCT2DEC', signature: 'OCT2DEC(number)', description: 'Chuyển đổi một số bát phân thành số thập phân.', category: 'Kỹ thuật' },
  { name: 'OCT2HEX', signature: 'OCT2HEX(number; [places])', description: 'Chuyển đổi một số bát phân thành thập lục phân.', category: 'Kỹ thuật' },
  { name: 'BITAND', signature: 'BITAND(number1; number2)', description: 'Trả về giá trị BITWISE "AND" của hai số.', category: 'Kỹ thuật' },
  { name: 'BITOR', signature: 'BITOR(number1; number2)', description: 'Trả về giá trị BITWISE "OR" của hai số.', category: 'Kỹ thuật' },
  { name: 'BITXOR', signature: 'BITXOR(number1; number2)', description: 'Trả về giá trị BITWISE "XOR" của hai số.', category: 'Kỹ thuật' },
  { name: 'BITLSHIFT', signature: 'BITLSHIFT(number; shift_amount)', description: 'Dịch chuyển một số sang trái một số lượng bit nhất định.', category: 'Kỹ thuật' },
  { name: 'BITRSHIFT', signature: 'BITRSHIFT(number; shift_amount)', description: 'Dịch chuyển một số sang phải một số lượng bit nhất định.', category: 'Kỹ thuật' },
  { name: 'COMPLEX', signature: 'COMPLEX(real_num; i_num; [suffix])', description: 'Chuyển đổi hệ số thực và ảo thành số phức.', category: 'Kỹ thuật' },
  { name: 'IMABS', signature: 'IMABS(inumber)', description: 'Trả về giá trị tuyệt đối (môđun) của một số phức.', category: 'Kỹ thuật' },
  { name: 'IMAGINARY', signature: 'IMAGINARY(inumber)', description: 'Trả về hệ số ảo của một số phức.', category: 'Kỹ thuật' },
  { name: 'IMARGUMENT', signature: 'IMARGUMENT(inumber)', description: 'Trả về đối số theta, góc tính bằng radian.', category: 'Kỹ thuật' },
  { name: 'IMCONJUGATE', signature: 'IMCONJUGATE(inumber)', description: 'Trả về số phức liên hợp của một số phức.', category: 'Kỹ thuật' },
  { name: 'IMDIV', signature: 'IMDIV(inumber1; inumber2)', description: 'Trả về thương số của hai số phức.', category: 'Kỹ thuật' },
  { name: 'IMPRODUCT', signature: 'IMPRODUCT(inumber1; [inumber2]; ...)', description: 'Trả về tích của các số phức.', category: 'Kỹ thuật' },
  { name: 'IMREAL', signature: 'IMREAL(inumber)', description: 'Trả về hệ số thực của một số phức.', category: 'Kỹ thuật' },
  { name: 'IMSUB', signature: 'IMSUB(inumber1; inumber2)', description: 'Trả về sự khác biệt giữa hai số phức.', category: 'Kỹ thuật' },
  { name: 'IMSUM', signature: 'IMSUM(inumber1; [inumber2]; ...)', description: 'Trả về tổng của các số phức.', category: 'Kỹ thuật' },
  { name: 'DELTA', signature: 'DELTA(number1; [number2])', description: 'Kiểm tra xem hai giá trị có bằng nhau không.', category: 'Kỹ thuật' },
  { name: 'GESTEP', signature: 'GESTEP(number; [step])', description: 'Kiểm tra xem một số lớn hơn hoặc bằng giá trị ngưỡng.', category: 'Kỹ thuật' },
  { name: 'ERF', signature: 'ERF(lower_limit; [upper_limit])', description: 'Trả về hàm lỗi.', category: 'Kỹ thuật' },

  // === KHỐI ===
  { name: 'CUBEKPIMEMBER', signature: 'CUBEKPIMEMBER(connection; kpi_name; kpi_property; [caption])', description: 'Trả về thuộc tính KPI (chỉ số hiệu suất chính) và hiển thị tên KPI trong ô.', category: 'Khối' },
  { name: 'CUBEMEMBER', signature: 'CUBEMEMBER(connection; member_expression; [caption])', description: 'Trả về một thành phần hoặc bộ dữ liệu trong một khối.', category: 'Khối' },
  { name: 'CUBEMEMBERPROPERTY', signature: 'CUBEMEMBERPROPERTY(connection; member_expression; property)', description: 'Trả về giá trị của thuộc tính thành viên trong khối.', category: 'Khối' },
  { name: 'CUBERANKEDMEMBER', signature: 'CUBERANKEDMEMBER(connection; set_expression; rank; [caption])', description: 'Trả về thành phần được xếp hạng thứ n hoặc thứ i trong một tập hợp.', category: 'Khối' },
  { name: 'CUBESET', signature: 'CUBESET(connection; set_expression; [caption]; [sort_order]; [sort_by])', description: 'Xác định một tập hợp thành phần được tính toán bằng cách gửi biểu thức tập hợp tới khối.', category: 'Khối' },
  { name: 'CUBESETCOUNT', signature: 'CUBESETCOUNT(set)', description: 'Trả về số phần tử trong tập hợp.', category: 'Khối' },
  { name: 'CUBEVALUE', signature: 'CUBEVALUE(connection; [member_expression1]; ...)', description: 'Trả về giá trị tổng hợp từ khối.', category: 'Khối' },
];

const CATEGORIES = [
  'Đã sử dụng gần đây',
  'Tất cả',
  'Tài chính',
  'Ngày Giờ',
  'Toán Lượng giác',
  'Thống kê',
  'Tìm kiếm & Tham chiếu',
  'Cơ sở dữ liệu',
  'Văn bản',
  'Lô-gic',
  'Thông tin',
  'Kỹ thuật',
  'Khối'
];

interface InsertFunctionDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InsertFunctionDialog({ isOpen, onClose }: InsertFunctionDialogProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tất cả');
  const [selectedFunc, setSelectedFunc] = useState<FunctionDef>(FUNCTIONS[0]);
  const [step, setStep] = useState<1 | 2>(1);
  const [argValues, setArgValues] = useState('');

  // Reset arguments when changing function
  useEffect(() => {
    setArgValues('');
  }, [selectedFunc]);

  if (!isOpen) return null;

  const filteredFunctions = FUNCTIONS.filter(f => {
    const matchSearch = !search || f.name.toLowerCase().includes(search.toLowerCase()) || f.description.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (category === 'Tất cả' || category === 'Đã sử dụng gần đây') return true;
    return f.category === category;
  });

  // Extract argument names from signature
  const argsMatch = selectedFunc.signature.match(/\((.*?)\)/);
  const argsString = argsMatch ? argsMatch[1] : '';
  const displayLabel = argsString.replace(/\[/g, '').replace(/\]/g, '').replace(/ /g, '') + (argsString ? '; *' : '');

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/20">
      <div className="bg-white rounded-md shadow-xl w-[450px] overflow-hidden flex flex-col text-[13px] text-slate-800">
        
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3">
          <h2 className="font-semibold text-lg text-green-800">Chèn hàm</h2>
          <button onClick={onClose} className="text-green-700 hover:bg-slate-100 p-1 rounded-full">
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {step === 1 ? (
          <>
            {/* Step 1 Content */}
            <div className="px-4 pb-4 flex flex-col gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-green-700">
                  <Search size={16} />
                </div>
                <input 
                  type="text" 
                  placeholder="Tìm kiếm chức năng" 
                  className="w-full border border-slate-300 rounded pl-8 pr-3 py-1.5 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-slate-700">Chọn danh mục</label>
                <select 
                  className="w-full border border-slate-300 rounded px-2 py-1.5 focus:outline-none focus:border-green-600 bg-white"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="border border-slate-300 rounded h-36 overflow-y-auto mt-1">
                {filteredFunctions.map((f, index) => (
                  <div 
                    key={f.name}
                    className={`px-3 py-1 cursor-pointer ${selectedFunc.name === f.name ? 'bg-slate-200 border-y border-slate-400 font-medium' : 'hover:bg-slate-100'}`}
                    onClick={() => setSelectedFunc(f)}
                  >
                    {f.name}
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-1">
                <div className="font-medium">{selectedFunc.signature}</div>
                <div className="text-slate-600 leading-relaxed">{selectedFunc.description}</div>
                <a href="#" className="text-green-700 hover:underline inline-block mt-1">Tìm hiểu thêm</a>
              </div>
            </div>

            {/* Step 1 Footer */}
            <div className="px-4 py-3 flex justify-between items-center bg-white border-t border-slate-200">
              <a href="#" className="text-green-700 hover:underline">Cung cấp thông tin phản hồi</a>
              <div className="flex gap-2">
                <Button 
                  className="bg-green-700 hover:bg-green-800 text-white font-medium rounded-sm px-4" 
                  size="sm"
                  onClick={() => setStep(2)}
                >
                  Tiếp theo
                </Button>
                <Button 
                  variant="outline"
                  className="border-slate-300 text-slate-800 font-medium rounded-sm px-4" 
                  size="sm"
                  onClick={() => {
                    CommandDispatcher.dispatch('EXCEL.INSERT.FORMULA', { text: `=${selectedFunc.name}(` });
                    onClose();
                  }}
                >
                  Chèn có xem trước
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Step 2 Content */}
            <div className="px-4 pb-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <div className="font-medium text-[14px] text-slate-800">{selectedFunc.name}</div>
                <div className="text-slate-600">
                  {selectedFunc.description} <a href="#" className="text-green-700 hover:underline">Tìm hiểu thêm</a>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <label className="font-semibold text-slate-800 border-b border-slate-200 pb-1">Đối số Hàm</label>
                
                <div className="flex flex-col gap-1 mt-1">
                  <span className="text-slate-600">{displayLabel}</span>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input 
                        type="text"
                        className="w-full border border-green-600 rounded px-2 py-1.5 pr-8 focus:outline-none focus:ring-1 focus:ring-green-600 font-mono"
                        value={argValues}
                        onChange={e => setArgValues(e.target.value)}
                        autoFocus
                      />
                      <div className="absolute inset-y-0 right-1 flex items-center cursor-pointer text-slate-500 hover:text-slate-800">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2.5 2.5H13.5V13.5H2.5V2.5Z" stroke="currentColor" strokeWidth="1.2"/>
                          <path d="M6 2.5V13.5" stroke="currentColor" strokeWidth="1.2"/>
                          <path d="M10 2.5V13.5" stroke="currentColor" strokeWidth="1.2"/>
                          <path d="M2.5 6H13.5" stroke="currentColor" strokeWidth="1.2"/>
                          <path d="M2.5 10H13.5" stroke="currentColor" strokeWidth="1.2"/>
                          <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          <path d="M14 11V14H11" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    <span className="text-slate-600">=</span>
                  </div>
                </div>

                <div className="bg-slate-100 rounded p-3 mt-4 text-slate-700">
                  <span className="font-semibold">{argsString.replace(/\[/g, '').replace(/\]/g, '').replace(/ /g, '')}::</span> là các đối số của hàm. Các đối số không bắt buộc được đặt trong ngoặc vuông [ ].
                </div>

                <div className="flex gap-2 items-center text-slate-800 mt-2 border-t border-slate-200 pt-3">
                  <span className="font-semibold">Kết quả hàm =</span>
                  <span className="text-slate-500 italic text-xs ml-1">Đang chờ tính toán...</span>
                </div>
              </div>
            </div>

            {/* Step 2 Footer */}
            <div className="px-4 py-3 flex justify-between items-center bg-white border-t border-slate-200">
              <a href="#" className="text-green-700 hover:underline">Cung cấp thông tin phản hồi</a>
              <div className="flex gap-2">
                <Button 
                  className="bg-green-700 hover:bg-green-800 text-white font-medium rounded-sm px-6" 
                  size="sm"
                  onClick={() => {
                    CommandDispatcher.dispatch('EXCEL.INSERT.FORMULA', { text: `=${selectedFunc.name}(${argValues})` });
                    onClose();
                    setStep(1); // Reset for next time
                  }}
                >
                  Chèn
                </Button>
                <Button 
                  variant="outline"
                  className="border-slate-300 text-slate-800 font-medium rounded-sm px-4" 
                  size="sm"
                  onClick={() => setStep(1)}
                >
                  Quay lại
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
