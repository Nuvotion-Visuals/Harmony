"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuerySuggestions = exports.getAllSuggestions = void 0;
var express_1 = __importDefault(require("express"));
var article_extractor_1 = require("@extractus/article-extractor");
// @ts-ignore
var youtube_captions_scraper_1 = require("youtube-captions-scraper");
var googlethis_1 = __importDefault(require("googlethis"));
var router = express_1.default.Router();
var handleError = function (res, error) {
    console.log('🟣', "I experienced the following error: ".concat(error));
    var status = error.statusCode || error.code || 500;
    var message = error.message || 'internal error';
    res.status(status).send({ status: status, message: message });
};
router.post('/parse-article', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var contentUrl, input, article, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                contentUrl = req.body.contentUrl;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                input = contentUrl;
                return [4 /*yield*/, (0, article_extractor_1.extract)(input)];
            case 2:
                article = _a.sent();
                console.log(article);
                res.send({ status: 200, data: { article: article } });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                handleError(res, error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/parse-youtube-video', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var videoUrl, youtube_parser, captions, transcript, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                videoUrl = req.body.videoUrl;
                youtube_parser = function (url) {
                    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
                    var match = url.match(regExp);
                    return match && match[7].length == 11 ? match[7] : '';
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, youtube_captions_scraper_1.getSubtitles)({
                        videoID: youtube_parser(videoUrl),
                        lang: 'en',
                    })];
            case 2:
                captions = _a.sent();
                transcript = captions.map(function (cap) { return cap.text; }).join(' ');
                res.send({ status: 200, data: { transcript: transcript } });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                handleError(res, error_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/search', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, options, results, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                query = req.query.q;
                options = {
                    page: 0,
                    safe: false,
                    parse_ads: false,
                    additional_params: {
                        hl: 'en'
                    }
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, googlethis_1.default.search(query, options)];
            case 2:
                results = _a.sent();
                //   const news = await google.getTopNews();
                //  console.info('Google Top News:', news);
                res.send({ status: 200, data: { results: results } });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.log('🟣', "I experienced the following error: ".concat(error_3));
                res.status(500).send({ status: 500, message: 'internal error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/search/images', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, options, results, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                query = req.query.q;
                options = {
                    page: 0,
                    safe: false,
                    parse_ads: false,
                    additional_params: {
                        hl: 'en'
                    }
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, googlethis_1.default.image(query, options)];
            case 2:
                results = _a.sent();
                //   const news = await google.getTopNews();
                //  console.info('Google Top News:', news);
                res.send({ status: 200, data: { results: results } });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                console.log('🟣', "I experienced the following error: ".concat(error_4));
                res.status(500).send({ status: 500, message: 'internal error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
function getAllSuggestions(string) {
    var searchURL = 'https://suggestqueries.google.com/complete/search?client=chrome&q=';
    return fetch(searchURL + encodeURIComponent(string))
        .then(function (response) {
        if (!response.ok) {
            throw new Error("Network response was not ok: ".concat(response.status));
        }
        return response.json();
    })
        .then(function (result) {
        var suggestions = result[1].map(function (suggestion, index) {
            return {
                suggestion: suggestion,
                relevance: result[4]['google:suggestrelevance'][index],
                type: result[4]['google:suggesttype'][index],
            };
        });
        return suggestions;
    })
        .catch(function (error) {
        throw new Error("Network error: ".concat(error.message));
    });
}
exports.getAllSuggestions = getAllSuggestions;
function getQuerySuggestions(string) {
    return getAllSuggestions(string).then(function (suggestions) {
        return suggestions.filter(function (suggestion) {
            return suggestion.type == 'QUERY';
        });
    });
}
exports.getQuerySuggestions = getQuerySuggestions;
router.get('/suggest', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, suggestions, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                query = req.query.q;
                if (!query) {
                    return [2 /*return*/, res.status(400).send({ status: 400, message: 'Missing query parameter' })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, getQuerySuggestions(query)];
            case 2:
                suggestions = _a.sent();
                res.send({ status: 200, data: { suggestions: suggestions } });
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                console.log("\uD83D\uDFE3 I experienced the following error: ".concat(error_5));
                res.status(500).send({ status: 500, message: 'internal error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
