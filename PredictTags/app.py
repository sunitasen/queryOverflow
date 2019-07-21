import nltk
nltk.download('stopwords')
from nltk.corpus import stopwords
from ast import literal_eval
import pandas as pd
import numpy as np
import re
from nltk.tokenize.treebank import TreebankWordTokenizer
import operator
from collections import defaultdict
from scipy import sparse as sp_sparse
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.multiclass import OneVsRestClassifier
from sklearn.linear_model import LogisticRegression, RidgeClassifier
from sklearn.svm import SVC
from sklearn.naive_bayes import GaussianNB
from sklearn.neural_network import MLPClassifier
from sklearn.decomposition.nmf import NMF
from sklearn.neighbors import KNeighborsClassifier
from sklearn.ensemble import AdaBoostClassifier
from sklearn.metrics import accuracy_score
from sklearn.metrics import f1_score
from sklearn.metrics import roc_auc_score 
from sklearn.metrics import average_precision_score
from sklearn.metrics import recall_score
import flask 
from bs4 import BeautifulSoup
from markdown import markdown
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import requests
import time


app = Flask(__name__)
CORS(app)



def read_data(filename):
    data = pd.read_csv(filename, sep='\t')
    data['tags'] = data['tags'].apply(literal_eval)
    return data

train = read_data('http://sunitasen.me/images/train.tsv')


X_train, y_train = train['title'].values, train['tags'].values

REPLACE_BY_SPACE_RE = re.compile('[/(){}\[\]\|@,;]')
BAD_SYMBOLS_RE = re.compile('[^0-9a-z #+_]')
STOPWORDS = set(stopwords.words('english'))

def text_prepare(text):
    """
        text: a string
        
        return: modified initial string
    """
    text = text.lower()
    text = re.sub(REPLACE_BY_SPACE_RE," ",text)
    text = re.sub(BAD_SYMBOLS_RE,"",text)
    text = text.split()
    return ' '.join([i for i in text if i not in STOPWORDS])


X_train = [text_prepare(x) for x in X_train]


# Dictionary of all tags from train corpus with their counts.
tags_counts =  defaultdict(int)
# Dictionary of all words from train corpus with their counts.
words_counts =  defaultdict(int)


for text in X_train:
    for word in text.split():
        words_counts[word] += 1


for tags in y_train:
    for tag in tags:
        tags_counts[tag] += 1

most_common_words = sorted(words_counts.items(), key=lambda x: x[1], reverse=True)[:6000]
DICT_SIZE = 5000
WORDS_TO_INDEX = {p[0]:i for i,p in enumerate(most_common_words[:DICT_SIZE])} ####### YOUR CODE HERE #######
INDEX_TO_WORDS = {WORDS_TO_INDEX[k]:k for k in WORDS_TO_INDEX}####### YOUR CODE HERE #######
ALL_WORDS = WORDS_TO_INDEX.keys()

def my_bag_of_words(text, words_to_index, dict_size):
    """
        text: a string
        dict_size: size of the dictionary
        
        return a vector which is a bag-of-words representation of 'text'
    """
    
    result_vector = np.zeros(dict_size)
    for word in text.split():
        if word in words_to_index:
            result_vector[words_to_index[word]] += 1
    
    return result_vector

X_train_mybag = sp_sparse.vstack([sp_sparse.csr_matrix(my_bag_of_words(text, WORDS_TO_INDEX, DICT_SIZE)) for text in X_train])

mlb = MultiLabelBinarizer(classes=sorted(tags_counts.keys()))
y_train = mlb.fit_transform(y_train)

def train_classifier(X_train, y_train, C=1.0, penalty='l2'):
    """
      X_train, y_train — training data
      
      return: trained classifier
    """
    
    lr = LogisticRegression(solver='newton-cg',C=C, penalty=penalty,n_jobs=-1)
    # lr.fit(X_train, y_train)
    ovr = OneVsRestClassifier(lr)
    ovr.fit(X_train, y_train)
    return ovr


classifier_mybag = train_classifier(X_train_mybag, y_train)


@app.route('/tags',methods=['GET', 'POST'])
def tagpredict():
    content = request.json
    data = content["query"]
    queryVal = []
    queryVal.append(data)
    print(queryVal)
    X_val_mybag = sp_sparse.vstack([sp_sparse.csr_matrix(my_bag_of_words(text, WORDS_TO_INDEX, DICT_SIZE)) for text in queryVal])
    y_val_predicted_labels_mybag = classifier_mybag.predict(X_val_mybag)
    val = mlb.inverse_transform(y_val_predicted_labels_mybag)
    val = list(val[0])
    print(val)
    return jsonify({"hello": val})


if __name__ == '__main__':
    try:
        port = int(sys.argv[1]) # This is for a command-line input
    except:
        port = 12346 # If you don't provide any port the port will be set to 12345



    app.run(port=port)